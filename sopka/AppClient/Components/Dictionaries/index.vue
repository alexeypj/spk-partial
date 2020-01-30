
<template>
    <div class="h100 inv" id="inventdiv">

        <div class="col-md-3 col-xs-4 bright h100">
			<div class="ibox float-e-margins">
				<div class="ibox-title mb5">
					<h5>Справочники</h5>
				</div>
				<div class="bordertop pright5 pleft5 ptop5">
					<div class="row no-margins">
						<div class="row no-margins">
							<div class="col-sm-12 m-b-xs search-p pleft0 pright5">
								<div class="input-group">
									<input type="text" placeholder="Поиск" class="input-sm form-control" v-model="SearchString" />
									<!--<span class="input-group-btn">
						</span>
						<a href="javascript:void(0)" class="vasuper" @click="find">
							<i class="fa fa-search" style="font-size:25px;"></i>
						</a>-->
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="ibox-content pright0 btop0 ptop0">
					<div class="table-responsive invtable">
						<table class="table">
							<tbody>
								<tr @click="select(dic)" :class="[{'selected': dic.IsSelected}]" v-for="dic in dics">
									<td>
										{{ dic.Title }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
        </div>

        <div class="col-md-9 col-xs-8 pleft0 h100 eqmap">
            <div v-if="SelectedDic">
                <component v-bind:is="SelectedDic.Component"></component>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
