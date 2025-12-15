<script lang="ts">
	import { character } from '$lib/stores/character';
	
	const aspectTypes = [
		{ key: 'ambition', label: 'Ambition', question: 'What drives you? What are your goals?' },
		{ key: 'belief', label: 'Belief', question: 'What do you believe in? What philosophies guide you?' },
		{ key: 'connection', label: 'Connection', question: 'Who/what matters to you? Important people, places, or events?' },
		{ key: 'disadvantage', label: 'Disadvantage', question: 'What holds you back? Your weaknesses and obstacles?' },
		{ key: 'expertise', label: 'Expertise', question: 'What are you good at? Your skills and methods?' }
	];
</script>

<div class="aspects-step">
	<div class="form-group">
		<label for="char-name">Character Name</label>
		<input
			id="char-name"
			type="text"
			bind:value={$character.name}
			placeholder="Enter character name"
		/>
	</div>
	
	<div class="form-group">
		<label for="player-name">Player Name</label>
		<input
			id="player-name"
			type="text"
			bind:value={$character.playerName}
			placeholder="Enter player name"
		/>
	</div>
	
	<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e0e0e0;" />
	
	<h3 style="margin-bottom: 1.5rem;">The Aspect Alphabet (ABCDE)</h3>
	
	{#each aspectTypes as aspectType}
		<div class="aspect-card">
			<div class="aspect-header">
				<h4>{aspectType.label}</h4>
				<p class="question">{aspectType.question}</p>
			</div>
			
			<div class="form-group">
				<textarea
					bind:value={$character.aspects[aspectType.key]}
					placeholder="Enter your {aspectType.label.toLowerCase()} aspect (3-8 words recommended)"
					rows="2"
				></textarea>
				<div class="help-text">
					Make it specific but flexible. Remember, aspects can help or hinder you!
				</div>
			</div>
		</div>
	{/each}
	
	<div class="info-box">
		<strong>💡 Tip:</strong> Good aspects are double-edged - they can be invoked for bonuses or compelled for complications.
		Aim for 3-8 words per aspect.
	</div>
</div>

<style>
	.aspects-step {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.aspect-card {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid var(--primary-color);
	}
	
	.aspect-header h4 {
		color: var(--primary-color);
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}
	
	.question {
		color: #666;
		font-style: italic;
		margin: 0 0 1rem 0;
	}
	
	.info-box {
		background: #e3f2fd;
		border-left: 4px solid #2196f3;
		padding: 1rem;
		border-radius: 4px;
		color: #1565c0;
	}
	
	textarea {
		resize: vertical;
		min-height: 60px;
	}
</style>
