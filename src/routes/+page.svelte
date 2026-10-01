<script lang="ts">
    import {getAppStoreContext} from '../store.svelte'
    const store = getAppStoreContext()

    const handleSubmit = (e:any) => { store.onInputSubmit(e) }
</script>

<div class="w-full text-center">
    <h1 class="text-9xl">Dumps</h1>
    <p>An app for just dumping everything that comes into your head and never having to deal with remembering it later lmao</p>
    <input type="text" class="border-2 rounded-lg w-5xl" placeholder="Search or type a dump here..." bind:value={store.userinput} onkeydown={handleSubmit}>
</div>
