<script lang="ts">
    import Icon from '@iconify/svelte';
    const typeOptions = [
        {
            label: 'Personal Information',
            options: [
                { value: 'first_name', label: 'First Name' },
                { value: 'last_name', label: 'Last Name' },
                { value: 'full_name', label: 'Full Name' },
                { value: 'username', label: 'Username' },
                { value: 'password', label: 'Password' },
            ],
        },
        {
            label: 'Contact Information',
            options: [
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'address', label: 'Address' },
                { value: 'city', label: 'City' },
                { value: 'state', label: 'State' },
                { value: 'zip', label: 'Zip/Postal Code' },
                { value: 'country', label: 'Country' },
            ],
        },
        {
            label: 'Employment',
            options: [
                { value: 'company', label: 'Company' },
                { value: 'job_title', label: 'Job Title' },
            ],
        },
        {
            label: 'Date & Time',
            options: [
                { value: 'date', label: 'Date' },
                { value: 'time', label: 'Time' },
                { value: 'timestamp', label: 'Timestamp' },
            ],
        },
        {
            label: 'Content',
            options: [
                { value: 'paragraph', label: 'Paragraph' },
                { value: 'text', label: 'Text' },
                { value: 'sentence', label: 'Sentence' },
                { value: 'word', label: 'Word' },
                { value: 'html', label: 'HTML' },
            ],
        },
        {
            label: 'Numbers',
            options: [
                { value: 'number', label: 'Number' },
                { value: 'integer', label: 'Integer' },
                { value: 'decimal', label: 'Decimal' },
                { value: 'hex', label: 'Hex' },
            ],
        },
    ];

    export let field: {
        column: string;
        type: string;
        min_length: string;
        max_length: string;
        errors: {
            column: string | undefined;
            type: string | undefined;
            min_length: string | undefined;
            max_length: string | undefined;
        };
    } = {
        column: '',
        type: 'first_name',
        min_length: '',
        max_length: '',
        errors: {
            column: '',
            type: '',
            min_length: '',
            max_length: '',
        },
    };
</script>

<div class="formfield">
    <div class="formfield__group">
        <label for="name">Column</label>
        <input
            type="text"
            id="column"
            name="column"
            bind:value={field.column}
            placeholder="Enter column name..."
            aria-invalid={field.errors.column ? 'true' : 'false'}
        />
        {#if field.errors.column}
            <p class="formfield__group-error">
                <Icon icon="heroicons-solid:exclamation" />{field.errors.column}
            </p>
        {/if}
    </div>
    <div class="formfield__group">
        <label for="name">Type</label>
        <select name="type" id="type" bind:value={field.type}>
            {#each typeOptions as typeOption}
                <optgroup label={typeOption.label}>
                    {#each typeOption.options as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </optgroup>
            {/each}
        </select>
    </div>
    <div class="formfield__group">
        <label for="name">Min Length</label>
        <input
            type="number"
            id="min_length"
            name="min_length"
            bind:value={field.min_length}
            placeholder="Enter min length..."
            aria-invalid={field.errors.min_length ? 'true' : 'false'}
        />
        {#if field.errors.min_length}
            <p class="formfield__group-error">
                <Icon icon="heroicons-solid:exclamation" />{field.errors
                    .min_length}
            </p>
        {/if}
    </div>
    <div class="formfield__group">
        <label for="name">Max Length</label>
        <input
            type="number"
            id="max_length"
            name="max_length"
            bind:value={field.max_length}
            placeholder="Enter max length..."
            aria-invalid={field.errors.max_length ? 'true' : 'false'}
        />
        {#if field.errors.max_length}
            <p class="formfield__group-error">
                <Icon icon="heroicons-solid:exclamation" />{field.errors
                    .max_length}
            </p>
        {/if}
    </div>
</div>

<style lang="scss">
    .formfield {
        display: flex;
        gap: 1rem;

        &__group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            & > label {
                font-size: 0.875rem;
                font-weight: 500;
                color: #333;
            }

            & > input {
                padding: 0.5rem;
                border: 1px solid #ccc;
                border-radius: 0.25rem;

                &[aria-invalid='true'] {
                    border-color: #9c2121;
                }
            }

            & > select {
                padding: 0.5rem;
                border: 1px solid #ccc;
                border-radius: 0.25rem;
            }

            &-error {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: #9c2121;

                & > :global(svg) {
                    margin-right: 0.25rem;
                }
            }
        }
    }
</style>
