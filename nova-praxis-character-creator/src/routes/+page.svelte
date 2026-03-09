<script lang="ts">
	import { character } from '$lib/stores/character';
	import StepAspects from '$lib/components/StepAspects.svelte';
	import StepState from '$lib/components/StepState.svelte';
	import StepHouse from '$lib/components/StepHouse.svelte';
	import StepSkills from '$lib/components/StepSkills.svelte';
	import StepRep from '$lib/components/StepRep.svelte';
	import StepStunts from '$lib/components/StepStunts.svelte';
	import StepSleeve from '$lib/components/StepSleeve.svelte';
	import StepGear from '$lib/components/StepGear.svelte';
	import StepFinalize from '$lib/components/StepFinalize.svelte';
	import CharacterLoader from '$lib/components/CharacterLoader.svelte';

	let currentStep = 0;
	
	const steps = [
		{ id: 'aspects', name: 'Aspects', component: StepAspects },
		{ id: 'state', name: 'Character State', component: StepState },
		{ id: 'house', name: 'House Affiliation', component: StepHouse },
		{ id: 'skills', name: 'Skills', component: StepSkills },
		{ id: 'rep', name: 'Reputation', component: StepRep, conditional: () => $character.houseAffiliation !== 'apostate' },
		{ id: 'stunts', name: 'Stunts', component: StepStunts },
		{ id: 'sleeve', name: 'Sleeve', component: StepSleeve, conditional: () => $character.characterState === 'sleeved' },
		{ id: 'gear', name: 'Gear', component: StepGear },
		{ id: 'finalize', name: 'Finalize', component: StepFinalize }
	];
	
	$: visibleSteps = steps.filter(step => !step.conditional || step.conditional());
	$: currentStepData = visibleSteps[currentStep];
	$: progress = ((currentStep + 1) / visibleSteps.length) * 100;
	
	function nextStep() {
		if (currentStep < visibleSteps.length - 1) {
			currentStep++;
		}
	}
	
	function previousStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}
	
	function goToStep(index: number) {
		currentStep = index;
	}
</script>

<div class="page-header">
	<CharacterLoader />
	<a href="/sheet" target="_blank">
		<button class="secondary">Print Sheet</button>
	</a>
</div>

<div class="character-creator">
	<div class="progress-bar">
		<div class="progress" style="width: {progress}%"></div>
	</div>
	
	<div class="steps-nav">
		{#each visibleSteps as step, index}
			<button
				class="step-button"
				class:active={index === currentStep}
				class:completed={index < currentStep}
				on:click={() => goToStep(index)}
			>
				<span class="step-number">{index + 1}</span>
				<span class="step-name">{step.name}</span>
			</button>
		{/each}
	</div>
	
	<div class="step-content card">
		<h2>{currentStepData.name}</h2>
		<svelte:component this={currentStepData.component} />
	</div>
	
	<div class="navigation-buttons">
		<button
			on:click={previousStep}
			disabled={currentStep === 0}
			class="secondary"
		>
			Previous
		</button>
		
		{#if currentStep < visibleSteps.length - 1}
			<button on:click={nextStep}>
				Next
			</button>
		{:else}
			<button class="secondary">
				Export Character
			</button>
		{/if}
	</div>
</div>

<style>
	.page-header {
		max-width: 1200px;
		margin: 1rem auto 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.character-creator {
		max-width: 1200px;
		margin: 0 auto;
	}
	
	.progress-bar {
		height: 8px;
		background: #e0e0e0;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 2rem;
	}
	
	.progress {
		height: 100%;
		background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
		transition: width 0.3s ease;
	}
	
	.steps-nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 0.5rem;
		margin-bottom: 2rem;
	}
	
	.step-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0.5rem;
		background: white;
		border: 2px solid #e0e0e0;
		color: var(--text-color);
		transition: all 0.3s ease;
	}
	
	.step-button:hover {
		border-color: var(--primary-color);
		transform: none;
	}
	
	.step-button.active {
		border-color: var(--primary-color);
		background: var(--primary-color);
		color: white;
	}
	
	.step-button.completed {
		border-color: var(--success-color);
		background: var(--success-color);
		color: white;
	}
	
	.step-number {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: currentColor;
		color: var(--card-background);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}
	
	.step-button.active .step-number,
	.step-button.completed .step-number {
		background: white;
		color: var(--primary-color);
	}
	
	.step-button.completed .step-number {
		color: var(--success-color);
	}
	
	.step-name {
		font-size: 0.875rem;
		text-align: center;
	}
	
	.step-content {
		min-height: 400px;
		margin-bottom: 2rem;
	}
	
	.navigation-buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
	
	.navigation-buttons button {
		flex: 1;
		max-width: 200px;
	}
</style>
