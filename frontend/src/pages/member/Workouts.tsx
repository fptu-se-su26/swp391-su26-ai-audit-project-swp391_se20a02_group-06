import React, { useEffect } from 'react'
import WorkoutIntro from '../../features/workout/components/WorkoutIntro'
import WorkoutLoading from '../../features/workout/components/WorkoutLoading'
import WorkoutResults from '../../features/workout/components/WorkoutResults'
import WorkoutSetup from '../../features/workout/components/WorkoutSetup'
import { generateExercises } from '../../features/workout/data/workoutExercises'
import { useWorkoutStore } from '../../store/useWorkoutStore'
import { createWorkoutPlan } from '../../api/workouts'

const Workouts: React.FC = () => {
    const { phase, formData, setPhase, setFormData, setExercises, setActivePlanId } = useWorkoutStore()

    useEffect(() => {
        if (phase === 'loading' && formData) {
            // Start fetching when we enter loading phase
            generateExercises(formData).then(async (exercises) => {
                setExercises(exercises)
                try {
                    const validExercises = exercises.filter(e => Number(e.id) > 0)
                    if (validExercises.length > 0) {
                        const plan = await createWorkoutPlan({
                            title: `${formData.goal || 'Custom'} Workout`,
                            goal: formData.goal,
                            targetDurationMinutes: formData.duration || 30,
                            exercises: validExercises.map((e, idx) => ({
                                exerciseId: Number(e.id),
                                sets: parseInt(String(e.sets).split('x')[0]) || 3,
                                reps: parseInt(String(e.sets).split('x')[1]) || 12,
                                durationSeconds: e.duration || 0,
                                exerciseOrder: idx + 1
                            }))
                        })
                        if (plan?.id) {
                            setActivePlanId(plan.id)
                        }
                    }
                } catch (err) {
                    console.warn("Could not save plan to DB, proceeding with session:", err)
                }
            })
        }
    }, [phase, formData, setExercises, setActivePlanId])

    if (phase === 'intro') {
        return <WorkoutIntro onStart={() => setPhase('setup')} />
    }

    if (phase === 'setup') {
        return (
            <WorkoutSetup
                onComplete={(data) => {
                    setFormData(data)
                    setPhase('loading')
                }}
            />
        )
    }

    if (phase === 'loading') {
        return <WorkoutLoading onComplete={() => setPhase('results')} />
    }

    return <WorkoutResults />
}

export default Workouts