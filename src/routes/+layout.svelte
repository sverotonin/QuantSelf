<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	const navItems = [
		{ path: '/', label: '主', en: 'Main', gradient: 'from-blue-500/10 to-purple-500/10' },
		{ path: '/habits', label: '習慣', en: 'Habits', gradient: 'from-emerald-500/10 to-teal-500/10' },
		{ path: '/ki', label: '気分', en: 'Mood', gradient: 'from-pink-500/10 to-rose-500/10' },
		{ path: '/budget', label: '予算', en: 'Budget', gradient: 'from-amber-500/10 to-orange-500/10' },
	];

	$: activeGradient = navItems.find(item => item.path === $page.url.pathname)?.gradient ?? navItems[0].gradient;
</script>

<div class="relative min-h-screen">
	<div class="fixed inset-0 bg-gradient-to-br from-gray-950 via-[#0a0014] to-[#120711] z-0" />
	<div class="fixed inset-0 bg-gradient-radial from-purple-950/20 via-transparent to-transparent z-0" />
	<div class="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50 z-0" />
	<div class="fixed inset-0 backdrop-blur-[100px] z-0" />
	
	<div class="relative z-10 min-h-screen text-gray-200">
		<main class="pb-20 p-8">
			<slot />
		</main>

		<nav class="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t border-white/5 transition-[background] duration-700">
			<div class="absolute inset-0 bg-gradient-to-r {activeGradient} transition-[background] duration-700" />
			<div class="relative max-w-lg mx-auto flex items-center justify-around px-4 pb-safe">
				{#each navItems as {path, label, en}}
					<a 
						href={path} 
						class="py-3 px-4 flex flex-col items-center gap-0.5"
					>
						<span class="text-sm transition-colors duration-200
							{$page.url.pathname === path ? 'text-white' : 'text-gray-500'}"
						>
							{label}
						</span>
						<span class="text-[9px] transition-colors duration-200
							{$page.url.pathname === path ? 'text-gray-300' : 'text-gray-600'}"
						>
							{en}
						</span>
					</a>
				{/each}
			</div>
		</nav>
	</div>
</div>
