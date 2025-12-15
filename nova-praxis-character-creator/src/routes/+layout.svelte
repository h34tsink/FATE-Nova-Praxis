<script lang="ts">
	import '../app.css';
</script>

<div class="app">
	<header>
		<h1>Nova Praxis Character Creator</h1>
		<p class="subtitle">FATE Edition</p>
	</header>
	
	<main>
		<slot />
	</main>
	
	<footer>
		<p>Nova Praxis Character Creator v1.0 | For personal campaign use</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		color: #fff;
		padding: 2rem;
		text-align: center;
		box-shadow: 0 2px 10px rgba(0,0,0,0.3);
	}

	header h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 700;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
	}

	.subtitle {
		margin: 0.5rem 0 0 0;
		font-size: 1.2rem;
		opacity: 0.9;
	}

	main {
		flex: 1;
		padding: 2rem;
		max-width: 1400px;
		width: 100%;
		margin: 0 auto;
	}

	footer {
		background: #1a1a2e;
		color: #fff;
		padding: 1rem;
		text-align: center;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	footer p {
		margin: 0;
	}
</style>
