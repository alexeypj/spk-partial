<template>
    <div class="form-horizontal">
        <div class="row">									
            <div class="form-group">
                <label class="col-md-12 ">Название</label>
                <div class="col-md-12" >
                    <input  type="text"
                            v-model="model.Title"                       
                            @change="update"
                            :class="['form-control', {'required-validation-error' : errors.has('Title')}]"
                            id="title"
                            placeholder="Заголовок"
                            name="Title"
                            data-vv-as="Заголовок"
                            data-vv-delay="2000"
                            v-validate="'required|min:3'" />                    
                    <span class="text-danger" v-show="errors.has('Title')">{{ errors.first('Title') }}</span>
                </div>
            </div>									
        </div>								
        <div class="row">									
            <div class="form-group">
                <label class="col-md-12">Родительская папка</label>
                <div class="col-md-12" >
                   <Tree v-model="selectedParentIds" id="parentFolder" :Folders="JSTree"/>
                </div>
            </div>									
        </div>							
    </div>        
</template>

<script src="./folderForm.ts" lang="ts">
</script>
