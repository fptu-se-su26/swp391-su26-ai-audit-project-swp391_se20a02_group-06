import React, { useState } from 'react'
import WorkoutIntro from '../../features/workout/components/WorkoutIntro'
import WorkoutLoading from '../../features/workout/components/WorkoutLoading'
import WorkoutResults from '../../features/workout/components/WorkoutResults'
import WorkoutSetup from '../../features/workout/components/WorkoutSetup'
import type { WorkoutFormData, WorkoutPhase } from '../../features/workout/types/workout'

const Workouts: React.FC = () => {
  const [phase, setPhase] = useState<WorkoutPhase>('intro')
  const [formData, setFormData] = useState<WorkoutFormData | null>(null)

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

  return (
    <WorkoutResults
      data={formData!}
      onReset={() => {
        setFormData(null)
        setPhase('intro')
      }}
    />
  )
}

export default Workouts
