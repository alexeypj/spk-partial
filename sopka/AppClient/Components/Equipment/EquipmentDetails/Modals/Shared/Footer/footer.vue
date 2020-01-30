<template>
    <div class="row">
        <div class="col-xs-12 text-right ptop15">
            <cancel-button :isSaving="IsSaving" className="btn btn-white btn-small" @click="$emit('cancel', true)" />            
            <save-button :isSaving="IsSaving" className="btn btn-success btn-small" @click="$emit('store')"/>
        </div>
    </div>
</template>

<script src="./footer" lang="ts">
</script>
