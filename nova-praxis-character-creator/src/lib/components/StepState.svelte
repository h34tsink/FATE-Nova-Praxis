<script lang="ts">
	import { character } from '$lib/stores/character';
	
	const states = [
		{
			id: 'pure',
			name: 'Pure (Original Body)',
			icon: '🧑',
			benefits: [
				'8 physical skill ranks',
				'+2 Refresh (5 total)',
				'Free Carpe Diem stunt',
				'+1 to one non-physical skill',
				'Physical Trait aspect'
			],
			drawbacks: [
				'Cannot resleeve if killed',
				'Lose all benefits if you get Apotheosis later'
			]
		},
		{
			id: 'sim',
			name: 'SIM (Digital Consciousness)',
			icon: '💻',
			benefits: [
				'7 physical skill ranks (for VR)',
				'Free SIM State stunt',
				'+1 SINC, +1 Software Engineering',
				'Choice of one bonus stunt',
				'Custom home virtual environment'
			],
			drawbacks: [
				'Requires drones for physical interaction',
				'Distance lag penalties on actions',
				'Must appear as semi-transparent ARO'
			]
		},
		{
			id: 'sleeved',
			name: 'Sleeved (Artificial Body)',
			icon: '🤖',
			benefits: [
				'Starting sleeve (cost based on Assets/Rep)',
				'Can resleeve if killed',
				'Full physical presence',
				'Customizable augmentations',
				'Upgrade path available'
			],
			drawbacks: [
				'Physical skills from sleeve',
				'Sleeve can be damaged/destroyed',
				'Maintenance costs',
				'Resleeving trauma'
			]
		}
	];
	
	function selectState(stateId: string) {
		character.setState(stateId as any);
		character.calculateRefresh();
	}
</script>

<div class="state-step">
	<p class="intro">
		Choose how your consciousness exists in the post-Apotheosis world. This is a fundamental choice
		that affects your capabilities and gameplay style.
	</p>
	
	<div class="state-grid">
		{#each states as state}
			<button
				class="state-card"
				class:selected={$character.characterState === state.id}
				on:click={() => selectState(state.id)}
			>
				<div class="state-icon">{state.icon}</div>
				<h3>{state.name}</h3>
				
				<div class="benefits">
					<h4>✅ Benefits:</h4>
					<ul>
						{#each state.benefits as benefit}
							<li>{benefit}</li>
						{/each}
					</ul>
				</div>
				
				<div class="drawbacks">
					<h4>⚠️ Drawbacks:</h4>
					<ul>
						{#each state.drawbacks as drawback}
							<li>{drawback}</li>
						{/each}
					</ul>
				</div>
			</button>
		{/each}
	</div>
	
	{#if $character.characterState}
		<div class="selection-info">
			✓ Selected: <strong>{states.find(s => s.id === $character.characterState)?.name}</strong>
		</div>
	{/if}
</div>

<style>
	.state-step {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.intro {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 4px;
		margin: 0;
	}
	
	.state-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	
	.state-card {
		background: white;
		border: 3px solid #e0e0e0;
		padding: 1.5rem;
		border-radius: 8px;
		text-align: left;
		transition: all 0.3s ease;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.state-card:hover {
		border-color: var(--primary-color);
		transform: translateY(-4px);
		box-shadow: 0 6px 20px rgba(0,0,0,0.15);
	}
	
	.state-card.selected {
		border-color: var(--success-color);
		background: #f0f9ff;
		box-shadow: 0 6px 20px rgba(0,0,0,0.15);
	}
	
	.state-icon {
		font-size: 3rem;
		text-align: center;
	}
	
	.state-card h3 {
		margin: 0;
		color: var(--primary-color);
		text-align: center;
	}
	
	.benefits h4,
	.drawbacks h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.benefits h4 {
		color: var(--success-color);
	}
	
	.drawbacks h4 {
		color: var(--warning-color);
	}
	
	.benefits ul,
	.drawbacks ul {
		margin: 0;
		padding-left: 1.5rem;
		font-size: 0.9rem;
	}
	
	.benefits li,
	.drawbacks li {
		margin-bottom: 0.25rem;
	}
	
	.selection-info {
		background: #d4edda;
		border: 1px solid #c3e6cb;
		color: #155724;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
		font-size: 1.1rem;
	}
</style>
