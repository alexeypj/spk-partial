  <template> 
    <div class="ibox-content">
        <div class="row">
            <div class="pagest m-b-xs">
                <select id="itemsPerPageSelector" class="input-sm form-control input-s-sm inline perpagesmall" @change="setItemsPerPage">
                    <option v-for="item in itemsPerPage" :key="item" :selected="item == filter.ItemsPerPage">
                        {{ item }}
                    </option>
                </select>
            </div>                    
            <div class="col-md-5 pull-right" v-if="hasSearch">
				<div class="input-group w100 text-right" style="display: flex;">
					<button class="btn btn-white pull-right btn-small mb0 mr5" v-if="hasFilters" @click="switchColumnFilters">
						<template v-if="showColumnFilters">
							<i class="fa fa-filter" title="Скрыть фильтры"></i>
						</template>
						<template v-else>
							<i class="fa fa-filter" title="Открыть фильтры"></i>
						</template>
					</button>
					<input type="text" placeholder="Поиск" class="input-sm form-control" v-model="filter.Query" @change="onQueryChanged">
				</div>
            </div>            
        </div>
        <div class="table-responsive">
            <table class="table datatable">
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.Name" @click="sort(column)">
							<div class="dflex-center">
								{{ column.DisplayName }}
								<span :class="['fa', 'pull-right', getSortIcon(column)]" v-if="column.Sort"></span>
							</div>
                        </th>        
                        <th v-if="hasActions">&nbsp;</th>                                      
                    </tr>
                </thead>
				<tbody>
					<tr v-if="hasFilters" v-show="showColumnFilters">
						<th v-for="column in columns" :key="'filters_' + column.Name" :class="getFilterCSS(column.Name)">
							<Columnfilter :options="getFilterOptions(column.Name)" @change="updateFilterValue" />
						</th>
						<th v-if="hasActions">&nbsp;</th>
					</tr>
					<tr v-for="(item) in items" :key="'tableitem_' + getKey(item)">
						<td @click="rowClick(getKey(item))" :title="getKey(item)">{{ getKey(item) }}</td>
						<td @click="rowClick(getKey(item))" :title="item[column.Name]" v-for="column in getDataColumns()" :key="column.Name">
                            <template v-if="column.UseComponent">
                                <component v-bind:is="column.Component" :Item="item"></component>
                            </template>
                            <template v-else>
                                <span v-html="item[column.Name]">
                                </span>
                            </template>
                        </td>
						<td class="pright5" v-if="hasActions">
							<slot name="columnActions" v-bind:item="item">
							</slot>
						</td>
					</tr>
				</tbody>                
            </table>
            <div class="btn-group">
                <button type="button" class="btn btn-white btn-small" @click="setPage(1)" :disabled="pagesNumber == 0 || filter.Page == 1"><i class="fa fa-step-backward"></i></button>
                <button type="button" class="btn btn-white btn-small" @click="setPage(filter.Page-1)" :disabled="pagesNumber == 0 || filter.Page == 1"><i class="fa fa-chevron-left"></i></button>
                <button :class="['btn btn-white btn-small', { 'active': filter.Page == i }]" 
                    v-for="i in pageButtonsRange" 
                    :key="i"
                    @click="setPage(i)">
                    {{ i }}
                </button>                
                <button type="button" class="btn btn-white btn-small" @click="setPage(filter.Page+1)" :disabled="pagesNumber == 0 || filter.Page == pagesNumber"><i class="fa fa-chevron-right"></i> </button>
                <button type="button" class="btn btn-white btn-small" @click="setPage(pagesNumber)" :disabled="pagesNumber == 0 || filter.Page == pagesNumber"><i class="fa fa-step-forward"></i> </button>
            </div>
            <div class="pull-right">
                Записи с {{totalItems > 0 ? filter.ItemsPerPage*(filter.Page-1)+1 : 0}} по {{filter.ItemsPerPage*(filter.Page-1)+items.length}} из {{totalItems}}
            </div>

        </div>
    </div>
</template>

<script lang="ts" src="./Datatable.ts">
</script>
