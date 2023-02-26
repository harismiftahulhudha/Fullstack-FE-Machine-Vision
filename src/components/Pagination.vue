<template>
    <div class="row mt-4" v-if="pagination.lastPage > 1">
        <nav aria-label="PaginationData">
            <ul class="pagination d-flex justify-content-md-center justify-content-lg-end">
                <li class="page-item" v-bind:class="{disabled: pagination.currentPage === pagination.firstPage}">
                    <a class="page-link" v-on:click="getPagination(pagination.firstPage)" aria-label="Previous">
                        <font-awesome-icon :icon="['fas', 'step-backward']" />
                    </a>
                </li>
                <li class="page-item" v-bind:class="{disabled: pagination.currentPage === pagination.firstPage}">
                    <a class="page-link" v-on:click="getPagination(pagination.prevPage)" aria-label="Previous">
                        <font-awesome-icon :icon="['fas', 'backward']" />
                    </a>
                </li>
                <li class="page-item" v-bind:class="{ active: pagination.currentPage === page }" v-for="page in pagination.pages">
                    <a class="page-link" v-on:click="getPagination(page)">{{ page }}</a>
                </li>
                <li class="page-item" v-bind:class="{disabled: pagination.currentPage === pagination.lastPage}">
                    <a class="page-link" v-on:click="getPagination(pagination.nextPage)" aria-label="Next">
                        <font-awesome-icon :icon="['fas', 'forward']" />
                    </a>
                </li>
                <li class="page-item" v-bind:class="{disabled: pagination.currentPage === pagination.lastPage}">
                    <a class="page-link" v-on:click="getPagination(pagination.lastPage)" aria-label="Next">
                        <font-awesome-icon :icon="['fas', 'step-forward']" />
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()

const props = defineProps({
    pagination: {
        type: Object,
        required: true
    },
    routeName: {
        type: String,
        required: true
    },
    query: {
        type: Object,
        required: true
    },
    modelValue: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const getPagination = (p) => {
    let params = {}
    params = props.query
    emit('update:modelValue', parseInt(p))
    if (parseInt(p) !== 1) {
        params.page = parseInt(p)
    } else {
        delete params.page
    }
    router.push({name: props.routeName, query: params})
}

</script>