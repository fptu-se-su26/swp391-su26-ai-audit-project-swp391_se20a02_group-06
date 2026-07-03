import React, { useEffect } from 'react'
import WorkoutIntro from '../../features/workout/components/WorkoutIntro.tsx'
import WorkoutLoading from '../../features/workout/components/WorkoutLoading.tsx'
import WorkoutResults from '../../features/workout/components/WorkoutResults.tsx'
import WorkoutSetup from '../../features/workout/components/WorkoutSetup.tsx'
import { generateExercises } from '../../features/workout/data/workoutExercises.ts'
import { useWorkoutStore } from '../../store/useWorkoutStore.ts'

import { createWorkoutPlan } from '../../api/workouts.ts'

const Workouts: React.FC = () => {
    const { phase, formData, setPhase, setFormData, setExercises, setActivePlanId } = useWorkoutStore()

    useEffect(() => {
        if (phase === 'loading' && formData) {
            // Start fetching when we enter loading phase
            generateExercises(formData).then(async (exercises) => {
                setExercises(exercises)
                
                // Save the generated plan to the backend
                try {
                    const planTitle = formData.goal ? `AI Plan: ${formData.goal}` : 'AI Generated Workout'
                    const planDto = {
                        title: planTitle,
                        goal: formData.goal,
                        targetCalories: formData.targetCalories,
                        targetDurationMinutes: formData.duration,
                        exercises: exercises.map((ex, index) => ({
                            exerciseId: ex.id,
                            sets: parseInt(ex.sets.split('x')[0]) || 3,
                            reps: parseInt(ex.sets.split('x')[1]) || 12,
                            durationSeconds: 0,
                            restSeconds: 60,
                            exerciseOrder: index + 1
                        }))
                    }
                    const savedPlan = await createWorkoutPlan(planDto)
                    setActivePlanId(savedPlan.id)
                } catch (error) {
                    console.error("Failed to save workout plan:", error)
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