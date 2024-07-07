<script lang="ts">
    import '../scss/global.scss';
</script>

<main class="main">
    <slot></slot>
</main>

<style lang="scss">
    .main {
        width: 100%;
        max-width: 1024px;
        background-color: #f9f9f9;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
    }
</style>
