import apiClient from '../../../lib/axios'
import type { ExerciseCardData, WorkoutFormData } from '../types/workout'

const WARMUP_DURATION_SECONDS = 300
const BREAK_TIME_DEFAULT = 30
const WARMUP_VIDEO = 'https://res.cloudinary.com/bucd22r4/video/upload/v1783523875/8017173747145_aqfvrr.mp4'

export const warmupExercise = {
    id: 0,
    title: 'Full Body Warmup',
    description: 'A light full-body warmup to prepare your body for the workout ahead. Follow along at a comfortable pace.',
    videoUrl: WARMUP_VIDEO,
    thumbnailUrl: WARMUP_VIDEO,
    muscleGroup: 'Full Body',
    muscleGroupId: 7,
    _isWarmup: true,
}

export const calcSetsReps = (timeBudgetSec: number, level: string, goal: string) => {
    let restTime = 60
    if (level === 'Intermediate') restTime = 45
    else if (level === 'Advanced') restTime = 30

    let reps = 12
    let timePerRep = 3
    if (goal === 'lose_weight' || goal === 'cardio') { reps = 16; timePerRep = 2 }
    else if (goal === 'build_muscle') { reps = 8; timePerRep = 4 }

    const timePerSet = reps * timePerRep + restTime
    let sets = Math.max(1, Math.round(timeBudgetSec / timePerSet))
    sets = Math.min(sets, 10)

    const actualTime = sets * timePerSet
    return { sets, reps, restTime, timePerRep, actualTime }
}

export const generateExercises = async (data: WorkoutFormData): Promise<ExerciseCardData[]> => {
    try {
        const response = await apiClient.get('/exercises')
        const allExercises: any[] = response.data

        let mainExercises: any[] = allExercises
        if (data.muscles && data.muscles.length > 0) {
            mainExercises = allExercises.filter(ex =>
                data.muscles.some(muscle => {
                    const nameMatch = ex.muscleGroup?.toLowerCase().includes(muscle.toLowerCase())
                    return nameMatch
                })
            )
        }
        mainExercises = mainExercises.sort(() => 0.5 - Math.random())

        const targetDurationSeconds = (data.duration || 30) * 60
        const mainTimeBudget = targetDurationSeconds - WARMUP_DURATION_SECONDS
        const safeMainTime = Math.max(mainTimeBudget, 120)

        const baseConfig = calcSetsReps(safeMainTime, data.level, data.goal)
        const baseTimePerExercise = (baseConfig.reps * baseConfig.timePerRep + baseConfig.restTime) * baseConfig.sets
        let numExercises = Math.max(1, Math.round(safeMainTime / baseTimePerExercise))
        numExercises = Math.min(numExercises, mainExercises.length, 12)

        const selectedMain = mainExercises.slice(0, numExercises)

        const result: ExerciseCardData[] = []

        const warmupCfg = calcSetsReps(WARMUP_DURATION_SECONDS, data.level, data.goal)
        result.push(buildExerciseCard(warmupExercise, 0, warmupCfg, true))

        const timePerMain = numExercises > 0 ? Math.floor(safeMainTime / numExercises) : safeMainTime
        selectedMain.forEach((ex, idx) => {
            const cfg = calcSetsReps(timePerMain, data.level, data.goal)
            result.push(buildExerciseCard(ex, idx + 1, cfg, false))
        })

        return result
    } catch (error) {
        console.error("Failed to fetch exercises:", error)
        return []
    }
}

export const buildExerciseCard = (ex: any, index: number, config: { sets: number; reps: number; restTime: number; timePerRep: number; actualTime: number }, isWarmup: boolean): ExerciseCardData => {
    const { sets, reps, restTime, actualTime } = config

    let exSetsStr = isWarmup ? formatTime(actualTime) : `${sets} x ${reps}`
    let exSetsLabel = isWarmup ? 'Duration' : 'Sets / Reps'

    const description = ex.description || 'Perform the movement with control. Make sure to engage your core and maintain steady breathing. Inhale as you lower and exhale as you exert force to push up.'
    const fullDescription = isWarmup
        ? `${description}\n\nWarmup: ${formatTime(actualTime)}. Go at a comfortable pace.`
        : `${description}\n\nRest ${restTime} seconds between sets.`

    const isImageUrl = ex.videoUrl && (ex.videoUrl.match(/\.(gif|png|jpg|jpeg|webp)(\?.*)?$/i) || ex.videoUrl.includes('/image/upload/'))
    const derivedImage = ex.thumbnailUrl || (
        ex.videoUrl?.includes('youtube.com')
            ? `https://img.youtube.com/vi/${ex.videoUrl.split('embed/')[1]?.split('?')[0]}/0.jpg`
            : isImageUrl ? ex.videoUrl : ''
    )

    return {
        id: ex.id,
        index: index + 1,
        name: isWarmup ? `Warmup: ${ex.title || 'Full Body Warmup'}` : (ex.title || 'Unknown Exercise'),
        tags: isWarmup ? ['Warmup', 'Full Body', formatTime(actualTime)] : (ex.muscleGroup ? [ex.muscleGroup] : ['Full Body']),
        sets: exSetsStr,
        setsLabel: exSetsLabel,
        description: fullDescription,
        videoUrl: ex.videoUrl || WARMUP_VIDEO,
        imageUrl: derivedImage,
        isActive: index === 0,
        isDone: false,
        isLocked: false,
        isWarmup,
        duration: actualTime,
        breakTime: isWarmup ? 0 : BREAK_TIME_DEFAULT,
    }
}

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}
