<template>
	<div name="modal">
		<div :class="'modal-mask '+maskCssClass">
			<div class="modal-wrapper">
				<div id="modal-wrapper-id"
					:class="['modal-container', {
						'modal-transition-normal': animationSpeed === 'normal', 
						'modal-transition-fast': animationSpeed === 'fast',
						'modal-lg': className === 'modal-lg',
						'modal-xlg': className === 'modal-xlg',
						'modal-900proc': className === 'modal-900proc',
						'modal-standard': className === 'modal-standard'
						}]"
					v-bind:style="{'min-height': min_height }">

					<div class="modal-header">
						<slot name="header">
							<h3 class="font14gray">{{title}} <span>{{description}}</span></h3>
						</slot>
						<button type="button" class="bootbox-close-button close" aria-hidden="true" @click="$emit('cancel', true)">×</button>
					</div>

					<div class="modal-body">
						<slot name="body">
							text
						</slot>
					</div>

					<div class="modal-footer" v-if="showFooter">
						<slot name="footer">
							<button class="btn btn-white mb0 btn-small" @click="$emit('cancel', true)" v-text="cancelText" v-if="cancelText"></button>
							<button class="btn btn-success btn-small" @click="$emit('ok')" v-text="okText"></button>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" src="./modal.ts"></script>
<style src="./modal.css"></style>