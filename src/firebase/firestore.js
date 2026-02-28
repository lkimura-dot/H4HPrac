import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './config'

const usersCollectionRef = collection(db, 'users')

const userDocRef = (uid) => doc(usersCollectionRef, uid)
const tasksCollectionRef = (uid) => collection(userDocRef(uid), 'tasks')
const gardenCollectionRef = (uid) => collection(userDocRef(uid), 'garden')

const DEFAULT_PROFILE = {
  email: '',
  totalPoints: 0,
  totalStudyTime: 0,
}

export const ensureUserProfile = async (user) => {
  if (!user?.uid) return

  const targetRef = userDocRef(user.uid)
  const existingSnapshot = await getDoc(targetRef)

  if (!existingSnapshot.exists()) {
    await setDoc(targetRef, {
      email: user.email ?? '',
      totalPoints: 0,
      totalStudyTime: 0,
    })
    return
  }

  const existingData = existingSnapshot.data()
  const profileUpdates = {}

  if (!existingData.email && user.email) profileUpdates.email = user.email
  if (typeof existingData.totalPoints !== 'number') profileUpdates.totalPoints = 0
  if (typeof existingData.totalStudyTime !== 'number') profileUpdates.totalStudyTime = 0

  if (Object.keys(profileUpdates).length > 0) {
    await setDoc(targetRef, profileUpdates, { merge: true })
  }
}

export const listenToUserProfile = (uid, onData, onError) =>
  onSnapshot(
    userDocRef(uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(DEFAULT_PROFILE)
        return
      }

      const data = snapshot.data()
      onData({
        email: data.email ?? '',
        totalPoints: data.totalPoints ?? 0,
        totalStudyTime: data.totalStudyTime ?? 0,
      })
    },
    onError,
  )

export const addStudyProgress = async (uid, minutes) => {
  if (!uid || minutes <= 0) return

  const targetRef = userDocRef(uid)

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(targetRef)
    const currentData = userSnapshot.exists()
      ? userSnapshot.data()
      : { ...DEFAULT_PROFILE }

    transaction.set(
      targetRef,
      {
        ...currentData,
        totalPoints: (currentData.totalPoints ?? 0) + minutes,
        totalStudyTime: (currentData.totalStudyTime ?? 0) + minutes * 60,
      },
      { merge: true },
    )
  })
}

export const listenToTasks = (uid, onData, onError) =>
  onSnapshot(
    query(tasksCollectionRef(uid), orderBy('createdAt', 'desc')),
    (snapshot) => {
      const tasks = snapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data(),
      }))
      onData(tasks)
    },
    onError,
  )

export const createTask = async (uid, title) => {
  const trimmedTitle = title.trim()
  if (!uid || !trimmedTitle) return

  await addDoc(tasksCollectionRef(uid), {
    title: trimmedTitle,
    completed: false,
    createdAt: serverTimestamp(),
  })
}

export const updateTask = async (uid, taskId, updates) => {
  if (!uid || !taskId) return
  await updateDoc(doc(tasksCollectionRef(uid), taskId), updates)
}

export const removeTask = async (uid, taskId) => {
  if (!uid || !taskId) return
  await deleteDoc(doc(tasksCollectionRef(uid), taskId))
}

export const listenToGarden = (uid, onData, onError) =>
  onSnapshot(
    query(gardenCollectionRef(uid), orderBy('purchasedAt', 'asc')),
    (snapshot) => {
      const items = snapshot.docs.map((itemDoc) => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      }))
      onData(items)
    },
    onError,
  )

export const purchaseFlower = async (uid, flower) => {
  if (!uid) throw new Error('You must be logged in to buy flowers.')
  if (!flower?.id || typeof flower.cost !== 'number') {
    throw new Error('Invalid flower selected.')
  }

  const targetUserRef = userDocRef(uid)
  const nextGardenItemRef = doc(gardenCollectionRef(uid))

  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(targetUserRef)
    if (!userSnapshot.exists()) {
      throw new Error('User profile is missing.')
    }

    const currentPoints = userSnapshot.data().totalPoints ?? 0

    if (currentPoints < flower.cost) {
      throw new Error('Not enough points for this flower.')
    }

    transaction.update(targetUserRef, { totalPoints: currentPoints - flower.cost })
    transaction.set(nextGardenItemRef, {
      flowerId: flower.id,
      purchasedAt: serverTimestamp(),
    })
  })

  return nextGardenItemRef.id
}
