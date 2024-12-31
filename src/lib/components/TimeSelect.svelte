<script lang="ts">
  interface TimeSelectProps {
    title: string;
    enTitle: string;
    value: string;
    onChange: (value: string) => void;
  }

  let props = $props();
  let { title = '', enTitle = '', value = '', onChange = () => {} } = props as TimeSelectProps;

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    onChange(target.value);
  }
</script>

<div class="flex flex-col space-y-1">
  <label class="text-sm font-medium">
    {title}
    <span class="block text-xs text-gray-400">{enTitle}</span>
  </label>
  <input 
    type="time" 
    class="bg-gray-800 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
    {value}
    onchange={handleChange}
  />
</div> 