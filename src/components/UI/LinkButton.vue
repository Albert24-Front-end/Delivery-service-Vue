<template>
    <a :href="link" :class="styles" type="button">{{ text }}</a>
</template>

<script setup lang="ts">

defineProps({
    text: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    styles: {
        type: String,
        required: false
    }
})
</script>