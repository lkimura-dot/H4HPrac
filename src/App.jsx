import { useEffect, useMemo, useState } from 'react'
import AuthForm from './components/AuthForm'
import GardenView from './components/GardenView'
import PointsSummary from './components/PointsSummary'
import StorePanel from './components/StorePanel'
import StudyTimer from './components/StudyTimer'
import TaskSidebar from './components/TaskSidebar'
import { logOutUser, signInWithEmail, signUpWithEmail, subscribeToAuthChanges } from './firebase/auth'
import { missingFirebaseConfig } from './firebase/config'
import {
  addStudyProgress,
  createTask,
  ensureUserProfile,
  listenToGarden,
  listenToTasks,
  listenToUserProfile,
  purchaseFlower,
  removeTask,
  updateTask,
} from './firebase/firestore'
import { useStudyTimer } from './hooks/useStudyTimer'

const EMPTY_PROFILE = {
  email: '',
  totalPoints: 0,
  totalStudyTime: 0,
}

const getFriendlyErrorMessage = (error) => {
  const code = error?.code ?? ''

  if (code === 'auth/invalid-credential') return 'Invalid email or password.'
  if (code === 'auth/email-already-in-use') return 'This email is already in use.'
  if (code === 'auth/weak-password') return 'Password should be at least 6 characters.'
  if (code === 'auth/invalid-email') return 'Please enter a valid email.'

  return error?.message ?? 'Something went wrong. Please try again.'
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')

  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [tasks, setTasks] = useState([])
  const [gardenItems, setGardenItems] = useState([])

  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [isGardenLoading, setIsGardenLoading] = useState(false)
  const [purchasingFlowerId, setPurchasingFlowerId] = useState('')
  const [appError, setAppError] = useState('')

  const [creditedMinutes, setCreditedMinutes] = useState(0)
  const [isSyncingStudyProgress, setIsSyncingStudyProgress] = useState(false)

  const { elapsedSeconds, isRunning, start, pause, reset } = useStudyTimer()

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user)
      setIsAuthLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!currentUser) {
      setProfile(EMPTY_PROFILE)
      setTasks([])
      setGardenItems([])
      setIsTasksLoading(false)
      setIsGardenLoading(false)
      setAppError('')
      setCreditedMinutes(0)
      reset()
      return undefined
    }

    let isCancelled = false

    setIsTasksLoading(true)
    setIsGardenLoading(true)
    setCreditedMinutes(0)
    setAppError('')

    ensureUserProfile(currentUser).catch((error) => {
      if (!isCancelled) setAppError(getFriendlyErrorMessage(error))
    })

    const unsubscribeUser = listenToUserProfile(
      currentUser.uid,
      (nextProfile) => {
        if (isCancelled) return

        setProfile({
          email: nextProfile.email || currentUser.email || '',
          totalPoints: nextProfile.totalPoints ?? 0,
          totalStudyTime: nextProfile.totalStudyTime ?? 0,
        })
      },
      (error) => {
        if (!isCancelled) setAppError(getFriendlyErrorMessage(error))
      },
    )

    const unsubscribeTasks = listenToTasks(
      currentUser.uid,
      (nextTasks) => {
        if (isCancelled) return
        setTasks(nextTasks)
        setIsTasksLoading(false)
      },
      (error) => {
        if (isCancelled) return
        setAppError(getFriendlyErrorMessage(error))
        setIsTasksLoading(false)
      },
    )

    const unsubscribeGarden = listenToGarden(
      currentUser.uid,
      (nextGardenItems) => {
        if (isCancelled) return
        setGardenItems(nextGardenItems)
        setIsGardenLoading(false)
      },
      (error) => {
        if (isCancelled) return
        setAppError(getFriendlyErrorMessage(error))
        setIsGardenLoading(false)
      },
    )

    return () => {
      isCancelled = true
      unsubscribeUser()
      unsubscribeTasks()
      unsubscribeGarden()
    }
  }, [currentUser, reset])

  useEffect(() => {
    if (!currentUser || isSyncingStudyProgress) return

    const reachedMinutes = Math.floor(elapsedSeconds / 60)
    if (reachedMinutes <= creditedMinutes) return

    let isCancelled = false
    const unsyncedMinutes = reachedMinutes - creditedMinutes

    const syncStudyProgress = async () => {
      setIsSyncingStudyProgress(true)

      try {
        await addStudyProgress(currentUser.uid, unsyncedMinutes)
        if (!isCancelled) {
          setCreditedMinutes((previousMinutes) => previousMinutes + unsyncedMinutes)
        }
      } catch (error) {
        if (!isCancelled) setAppError(getFriendlyErrorMessage(error))
      } finally {
        if (!isCancelled) setIsSyncingStudyProgress(false)
      }
    }

    syncStudyProgress()

    return () => {
      isCancelled = true
    }
  }, [currentUser, elapsedSeconds, creditedMinutes, isSyncingStudyProgress])

  const handleSignIn = async (email, password) => {
    setAuthError('')
    setIsAuthSubmitting(true)
    try {
      await signInWithEmail(email, password)
    } catch (error) {
      setAuthError(getFriendlyErrorMessage(error))
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleSignUp = async (email, password) => {
    setAuthError('')
    setIsAuthSubmitting(true)
    try {
      await signUpWithEmail(email, password)
    } catch (error) {
      setAuthError(getFriendlyErrorMessage(error))
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleLogOut = async () => {
    setAppError('')
    try {
      await logOutUser()
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleResetTimer = () => {
    reset()
    setCreditedMinutes(0)
  }

  const handleAddTask = async (title) => {
    if (!currentUser) return
    setAppError('')
    try {
      await createTask(currentUser.uid, title)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleToggleTask = async (taskId, isCompleted) => {
    if (!currentUser) return
    setAppError('')
    try {
      await updateTask(currentUser.uid, taskId, { completed: !isCompleted })
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleRenameTask = async (taskId, title) => {
    if (!currentUser) return
    setAppError('')
    try {
      await updateTask(currentUser.uid, taskId, { title: title.trim() })
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!currentUser) return
    setAppError('')
    try {
      await removeTask(currentUser.uid, taskId)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    }
  }

  const handlePurchaseFlower = async (flower) => {
    if (!currentUser) return
    setAppError('')
    setPurchasingFlowerId(flower.id)

    try {
      await purchaseFlower(currentUser.uid, flower)
    } catch (error) {
      setAppError(getFriendlyErrorMessage(error))
    } finally {
      setPurchasingFlowerId('')
    }
  }

  const points = useMemo(() => profile.totalPoints ?? 0, [profile.totalPoints])
  const totalStudyTime = useMemo(
    () => profile.totalStudyTime ?? 0,
    [profile.totalStudyTime],
  )

  if (missingFirebaseConfig.length > 0) {
    return (
      <main className="mind-garden-dashboard mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="garden-card w-full p-6 text-amber-900">
          <h1 className="text-xl font-semibold">Firebase config missing</h1>
          <p className="mt-2 text-sm">
            Create a <code>.env</code> file using <code>.env.example</code> and add your Firebase
            project keys.
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {missingFirebaseConfig.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        </div>
      </main>
    )
  }

  if (isAuthLoading) {
    return (
      <main className="mind-garden-auth-screen">
        <div className="mind-garden-cloud mind-garden-cloud-left" />
        <div className="mind-garden-cloud mind-garden-cloud-right" />
        <div className="mind-garden-grass" />
        <div className="mind-garden-auth-content flex min-h-screen items-center justify-center px-4 py-10">
          <p className="garden-title-font rounded-2xl bg-white/80 px-5 py-3 text-2xl font-semibold text-[#8f7654]">
            loading...
          </p>
        </div>
      </main>
    )
  }

  if (!currentUser) {
    return (
      <main className="mind-garden-auth-screen">
        <div className="mind-garden-cloud mind-garden-cloud-left" />
        <div className="mind-garden-cloud mind-garden-cloud-right" />
        <div className="mind-garden-grass" />

        <div className="mind-garden-auth-content flex min-h-screen items-center justify-center px-4 py-10">
          <AuthForm
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            isSubmitting={isAuthSubmitting}
            errorMessage={authError}
          />
        </div>
      </main>
    )
  }

  return (
    <main className="mind-garden-dashboard px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="garden-card mb-4 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="garden-title-font text-base font-semibold uppercase tracking-wide text-[#8f7654]">
              BloomFocus
            </p>
            <h1 className="garden-title-font text-4xl leading-none font-bold text-[var(--garden-heading)]">
              mind garden
            </h1>
          </div>
          <button
            className="garden-btn-primary px-4 py-2 text-sm"
            onClick={handleLogOut}
            type="button"
          >
            log out
          </button>
        </header>

        {appError ? (
          <p className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            {appError}
          </p>
        ) : null}

        <div className="mb-4">
          <PointsSummary email={profile.email} points={points} totalStudyTimeSeconds={totalStudyTime} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px,1fr,300px]">
          <TaskSidebar
            tasks={tasks}
            isLoading={isTasksLoading}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onRenameTask={handleRenameTask}
          />

          <div className="space-y-4">
            <StudyTimer
              elapsedSeconds={elapsedSeconds}
              isRunning={isRunning}
              isSyncing={isSyncingStudyProgress}
              onStart={start}
              onPause={pause}
              onReset={handleResetTimer}
            />
            <GardenView gardenItems={gardenItems} isLoading={isGardenLoading} />
          </div>

          <StorePanel
            points={points}
            onPurchase={handlePurchaseFlower}
            purchasingFlowerId={purchasingFlowerId}
          />
        </div>
      </div>
    </main>
  )
}

export default App
