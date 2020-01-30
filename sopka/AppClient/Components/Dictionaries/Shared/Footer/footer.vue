<template>
    <div class="row">
        <div class="pull-right ptop15" style="margin-right: 15px;">
            <cancel-button :isSaving="IsSaving" className="btn btn-white btn-small" @click="$emit('cancel')" />
            <save-button :isSaving="IsSaving" className="btn btn-success btn-small" @click="$emit('store')" v-if="Id > 0" />
            <save-button :isSaving="IsSaving" className="btn btn-success btn-small" @click="$emit('storeAndExit')" enabledText="Сохранить и закрыть" />            
        </div>
    </div>    
</template>

<script src="./footer.ts" lang="ts">
</script>
