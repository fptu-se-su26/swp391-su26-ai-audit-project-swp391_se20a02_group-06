import React, { useEffect } from 'react'
import WorkoutIntro from '../../features/workout/components/WorkoutIntro'
import WorkoutLoading from '../../features/workout/components/WorkoutLoading'
import WorkoutResults from '../../features/workout/components/WorkoutResults'
import WorkoutSetup from '../../features/workout/components/WorkoutSetup'
import { generateExercises } from '../../features/workout/data/workoutExercises'
import { useWorkoutStore } from '../../store/useWorkoutStore'

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