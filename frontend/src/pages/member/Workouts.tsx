import React, { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import WorkoutIntro from '../../features/workout/components/WorkoutIntro.tsx'
import WorkoutLoading from '../../features/workout/components/WorkoutLoading.tsx'
import WorkoutResults from '../../features/workout/components/WorkoutResults.tsx'
import WorkoutSetup from '../../features/workout/components/WorkoutSetup.tsx'
import { generateExercises, generateWeeklyExercises } from '../../features/workout/data/workoutExercises.ts'
import { useWorkoutStore } from '../../store/useWorkoutStore.ts'

import { createWorkoutPlan } from '../../api/workouts.ts'

const Workouts: React.FC = () => {
    const { phase, formData, setPhase, setFormData, setExercises, setActivePlanId, setWeeklyPlans } = useWorkoutStore()
    const toast = useToast()

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
                                    exerciseId: ex.id,
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
                        } catch (error: any) {
                            const errorMsg = error.response?.data?.message || error.message;
                            console.error("Failed to save workout plan for day:", day.title, errorMsg, error)
                            savedDays.push(day)
                        }
                    }
                    setWeeklyPlans(savedDays)
                }).catch((error: any) => {
                    const errorMsg = error.response?.data?.message || "Could not generate your workout plan. Please try again.";
                    console.error("Failed to generate weekly exercises", errorMsg)
                    toast({
                        title: "AI Generation Failed",
                        description: errorMsg,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    })
                    setPhase('setup')
                })
            } else {
                // Start fetching when we enter loading phase
                generateExercises(formData).then(async (exercises) => {
                    // Save the generated plan to the backend FIRST
                    try {
                        const planTitle = formData.goal ? `AI Plan: ${formData.goal}` : 'AI Generated Workout'
                        const planDto = {
                            title: planTitle,
                            goal: formData.goal,
                            targetCalories: formData.targetCalories,
                            targetDurationMinutes: formData.duration,
                            exercises: exercises.map((ex, index) => ({
                                exerciseId: ex.id,
                                sets: ex.setsCount ?? 3,
                                reps: ex.repsCount ?? 12,
                                durationSeconds: ex.durationSeconds ?? 0,
                                restSeconds: ex.restSeconds ?? 60,
                                exerciseOrder: index + 1
                            }))
                        }

                        const savedPlan = await createWorkoutPlan(planDto)
                        setActivePlanId(savedPlan.id)
                    } catch (error: any) {
                        const data = error.response?.data;
                        const errorMsg = data?.message || (data?.errors ? JSON.stringify(data.errors) : data?.title) || error.message;
                        console.error("Failed to save workout plan:", errorMsg, error)
                        toast({
                            title: "Save Plan Failed",
                            description: "Could not save the generated plan to database: " + errorMsg,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                            position: 'top'
                        })
                    }
                    
                    // Set exercises last to trigger loading completion
                    setExercises(exercises)
                }).catch((error: any) => {
                    const errorMsg = error.response?.data?.message || "Could not generate your workout plan. Please try again.";
                    console.error("Failed to generate daily exercises", errorMsg)
                    toast({
                        title: "AI Generation Failed",
                        description: errorMsg,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    })
                    setPhase('setup')
                })
            }
        }
    }, [phase, formData, setExercises, setActivePlanId, setWeeklyPlans, setPhase, toast])

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