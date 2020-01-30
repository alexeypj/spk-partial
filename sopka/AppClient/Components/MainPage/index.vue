<template>
    <div class="col-lg-12 pleft0 pright0 h100" style="display:flex; flex-direction:column;">
        <div id="app" class="text-center">
            <h1 class="display-4">{{ Settings.Logo.PortalTitle }}</h1>
        </div>
        <div class="start_content" style="flex-grow: 1;">
            <infTable :counters="summary.Counters" />
            <div class="col-sm-6 h100 pleft0" style="display: flex;flex-direction: column;">
                <div style="flex-grow:1;max-height:50%;" class="white-bg startrighttop">
                    <template  v-if="Settings.IsLimited == false">
                        <smallMessage />
                        <mailBoard />
                    </template>
                </div>
                <div>
                    <SmallMap width="100%"  :objects="summary.Objects" v-if="initialized" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts"></script>


<style>
    .start_block {
        padding: 15px 10px;
        float: left;
        width: 100%;
        background-color: white;
    }

    .start_block_sm {
        padding: 10px 10px;
        float: left;
        width: 100%;
        display: flex;
        background-color: white;
    }

    .fa25x {
        font-size: 2.5em;
    }

    .w3d {
        width: 50px;
    }

    .start_content {
        padding-left: 15px;
        padding-top: 15px;
    }
</style>