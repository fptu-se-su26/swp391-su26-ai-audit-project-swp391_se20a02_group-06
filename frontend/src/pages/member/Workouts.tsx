import React, { useEffect } from 'react'
import WorkoutIntro from '../../features/workout/components/WorkoutIntro'
import WorkoutLoading from '../../features/workout/components/WorkoutLoading'
import WorkoutResults from '../../features/workout/components/WorkoutResults'
import WorkoutSetup from '../../features/workout/components/WorkoutSetup'
import { generateExercises, generateWeeklyExercises } from '../../features/workout/data/workoutExercises'
import { useWorkoutStore } from '../../store/useWorkoutStore'
import { createWorkoutPlan } from '../../api/workouts'

const Workouts: React.FC = () => {
    const { phase, formData, setPhase, setFormData, setExercises, setActivePlanId, setWeeklyPlans } = useWorkoutStore()

    useEffect(() => {
        if (phase === 'loading' && formData) {
            if (formData.planType === 'weekly') {
                generateWeeklyExercises(formData).then(async (weeklyDays) => {
                    const savedDays = []
                    for (const day of weeklyDays) {
                        try {
                            const planTitle = `AI Plan: Weekly - ${day.title}`
                            const planDto = {
                                title: planTitle,
                                goal: day.goal,
                                targetCalories: day.targetCalories,
                                targetDurationMinutes: day.targetDurationMinutes,
                                exercises: day.exercises.map((ex, index) => ({
                                    exerciseId: Number(ex.id) || 0,
                                    sets: ex.setsCount ?? 3,
                                    reps: ex.repsCount ?? 12,
                                    durationSeconds: ex.durationSeconds ?? 0,
                                    restSeconds: ex.restSeconds ?? 60,
                                    exerciseOrder: index + 1
                                }))
                            }

                            const savedPlan = await createWorkoutPlan(planDto)
                            savedDays.push({
                                ...day,
                                activePlanId: savedPlan.id
                            })
                        } catch (error) {
                            console.error("Failed to save workout plan for day:", day.title, error)
                            savedDays.push(day)
                        }
                    }
                    setWeeklyPlans(savedDays)
                })
            } else {
                generateExercises(formData).then(async (exercises) => {
                    setExercises(exercises)
                    try {
                        const planTitle = formData.goal ? `AI Plan: ${formData.goal}` : 'AI Generated Workout'
                        const planDto = {
                            title: planTitle,
                            goal: formData.goal,
                            targetCalories: formData.targetCalories,
                            targetDurationMinutes: formData.duration,
                            exercises: exercises.map((ex, index) => ({
                                exerciseId: Number(ex.id) || 0,
                                sets: ex.setsCount ?? 3,
                                reps: ex.repsCount ?? 12,
                                durationSeconds: ex.durationSeconds ?? 0,
                                restSeconds: ex.restSeconds ?? 60,
                                exerciseOrder: index + 1
                            }))
                        }

                        const savedPlan = await createWorkoutPlan(planDto)
                        if (savedPlan?.id) {
                            setActivePlanId(savedPlan.id)
                        }
                    } catch (error) {
                        console.error("Failed to save workout plan:", error)
                    }
                })
            }
        }
    }, [phase, formData, setExercises, setActivePlanId, setWeeklyPlans])

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