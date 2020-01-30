<template>
    <div class="ibox-content">
        <div class="row no-margins">
            <div class="pagest m-b-xs pleft0">
                <select id="itemsPerPageSelector" class="input-sm form-control input-s-sm inline perpagesmall" @change="setItemsPerPage">
                    <option v-for="item in itemsPerPage" :key="item" :selected="item == filter.ItemsPerPage">
                        {{ item }}
                    </option>
                </select>
            </div>

            <div class="col-md-5 pull-right pright0">
				<div class="input-group w100 text-right" style="display: flex;">
					<button class="btn btn-white pull-right btn-small mb0 mr5" v-if="hasFilters" @click="switchColumnFilters">
						<template v-if="showColumnFilters">
							<i class="fa fa-filter" title="Скрыть фильтры"></i>
						</template>
						<template v-else>
							<i class="fa fa-filter" title="Открыть фильтры"></i>
						</template>
					</button>
					<input type="text" placeholder="Поиск" class="input-sm form-control" style="margin-right: 5px;" v-model="searchString">
					<!--<a href="javascript:void(0)" class="vasuper" @click="search">
		<i class="fa fa-search fa-2x"></i>
	</a>-->
				</div>
            </div>

        </div>
        <div class="table-responsive">
            <table class="table datatable">
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.Name">{{ column.DisplayName }}</th>
                        <th v-if="removeHandler">&nbsp;</th>
                    </tr>
                </thead>
				<tbody>
					<tr v-if="hasFilters" v-show="showColumnFilters">
						<th v-for="column in columns" :key="'filters_' + column.Name">
							<input type="text" :placeholder="column.DisplayName" class="form-control" @keyup="searchByColumn(column.Name, $event)" />
						</th>
						<th v-if="removeHandler">&nbsp;</th>
					</tr>
					<tr v-for="(item, idx) in items" :key="getKey(item)">
						<td>{{ idx + 1 }}</td>
						<td v-for="column in getDataColumns()" :key="column">{{ item[column] }}</td>
						<td class="pright5">
							<div class="input-group w100">
								<select2 :class="['']"
										 :options="actions"
										 @input="(value, id, el) => selectorChange(value, item, el)"
										 v-model="actionValue"
										 :allowClear="false"
										 :showSearchInput="false" />
							</div>
						</td>
					</tr>
				</tbody>
            </table>
            <div class="btn-group">
                <button type="button" class="btn btn-white btn-small" @click="setPage(filter.Page-1)" :disabled="pagesNumber == 0 || filter.Page == 1"><i class="fa fa-chevron-left"></i></button>
                <button :class="['btn btn-white btn-small', { 'active': filter.Page == i }]"
                        v-for="i in pagesNumber"
                        :key="i"
                        @click="setPage(i)">
                    {{ i }}
                </button>
                <button type="button" class="btn btn-white btn-small" @click="setPage(filter.Page+1)" :disabled="pagesNumber == 0 || filter.Page == pagesNumber"><i class="fa fa-chevron-right"></i> </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./DictionaryDatatable.ts">
</script>
