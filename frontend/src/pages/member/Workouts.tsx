import React, { useEffect } from 'react'
import WorkoutIntro from '../../features/workout/components/WorkoutIntro.tsx'
import WorkoutLoading from '../../features/workout/components/WorkoutLoading.tsx'
import WorkoutResults from '../../features/workout/components/WorkoutResults.tsx'
import WorkoutSetup from '../../features/workout/components/WorkoutSetup.tsx'
import { generateExercises } from '../../features/workout/data/workoutExercises.ts'
import { useWorkoutStore } from '../../store/useWorkoutStore.ts'

const Workouts: React.FC = () => {
    const { phase, formData, setPhase, setFormData, setExercises } = useWorkoutStore()

    useEffect(() => {
        if (phase === 'loading' && formData) {
            // Start fetching when we enter loading phase
            generateExercises(formData).then((exercises) => {
                setExercises(exercises)
            })
        }
    }, [phase, formData, setExercises])

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