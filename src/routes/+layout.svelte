<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	const navItems = [
		{ path: '/', label: '主', en: 'Main' },
		{ path: '/habits', label: '習慣', en: 'Habits' },
		{ path: '/ki', label: '気分', en: 'Mood' },
		{ path: '/budget', label: '予算', en: 'Budget' },
	];
</script>

<div class="relative min-h-screen">
	<div class="fixed inset-0 bg-gradient-to-br from-gray-950 via-[#0a0014] to-[#120711] z-0" />
	<div class="fixed inset-0 bg-gradient-radial from-purple-950/20 via-transparent to-transparent z-0" />
	<div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50 z-0" />
	<div class="fixed inset-0 backdrop-blur-[100px] z-0" />
	
	<div class="relative z-10 min-h-screen text-gray-200">
		<nav class="fixed top-0 left-0 w-16 h-screen bg-black/20 backdrop-blur-md border-r border-white/5">
			<div class="flex flex-col items-center py-8 space-y-8">
				{#each navItems as {path, label, en}}
					<a 
						href={path} 
						class="w-12 h-12 flex flex-col items-center justify-center rounded-lg hover:bg-white/10 transition-colors {$page.url.pathname === path ? 'bg-white/10' : ''}"
					>
						<span class="text-sm font-semibold">{label}</span>
						<span class="text-[10px] text-gray-400">{en}</span>
					</a>
				{/each}
			</div>
		</nav>

		<main class="ml-16 p-8">
			<slot />
		</main>
	</div>
</div>
