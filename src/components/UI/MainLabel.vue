<template>
    <div class="px-3.5 py-3 bg-black text-white text-sm font-medium leading-[1.1] rounded-[10px]">{{ text }}</div>
</template>

<script setup lang="ts">
defineProps({
    text: {
        type: String,
        required: true,
    }
})
</script>