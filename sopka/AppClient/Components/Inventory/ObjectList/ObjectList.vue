<template>
    <div class="table-responsive invtable">
        <table class="table" v-if="State.IsListLoading == false">
            <tbody>
                <ObjectEntry 
                    v-for="entry in Objects" 
                    :key="entry.Id" :Entry="entry" 
                    :ClickHandler="clickHandler"
                    :SelectedId="SelectedObjectId"
                />                                 
            </tbody>
        </table>
        <div v-else>Loader</div> 
    </div>    
</template>

<script lang="ts" src="./ObjectList.ts"></script>