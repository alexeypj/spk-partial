<template>
	<div id="wrapper">
		<nav class="navbar-default navbar-static-side" role="navigation" style="height:100%;">
			<div class="sidebar-collapse">
				<ul class="nav" id="side-menu">
					<li class="nav-header" style="padding:0;">
						<div class="dropdown profile-element">
							<template v-if="IsAuthenticated">
								<span class="mr5">
									<!--<img alt="image" class="img-circle" src="/img/profile_small.jpg" />-->
									<router-link to="/"><img :src="Settings.Logo.PortalLogo" class="imglogo"></router-link>
								</span>
										<span class="m-t-xs" style="display: flex;flex-direction: column;">
											<strong class="font-bold text-ellips text-white" :title="CurrentUser.UserName">{{CurrentUser.UserName}}</strong>
											<strong class="text-navy" :title="CurrentUser.UserRoles[0].Name">
                                                {{CurrentUser.UserRoles[0].ShortTitle}}
                                            </strong>
										</span>
								<a class="navbar-minimalize minimalize-styl-2 btn smallhideclose" href="#"><i class="fa fa-close fa-lg"></i></a>
							</template>
							<template v-else>
								<a data-toggle="dropdown" class="dropdown-toggle" href="#">
									<span class="clear">
										<span class="block m-t-xs">
											<strong class="font-bold">Неавторизованный пользователь</strong>
										</span>
									</span>
								</a>
							</template>
						</div>
						<div class="logo-element">
							<router-link to="/"><img :src="Settings.Logo.PortalLogo" /></router-link>
						</div>
					</li>

                    <template v-if="IsAuthenticated">

                        <li v-if="DisplayIncidents" :class="{active:path.match('/Incident')}">
                            <router-link to="/Incident" title="Инциденты">
                                <i class="fa fa-crosshairs"></i> 
                                <span class="nav-label">Инциденты</span>
                            </router-link>
                        </li>

                        <li v-if="DisplayInventories" :class="{active:path.match('Inventory')}">
                            <router-link to="/Inventory" id="aobjects" title="Объекты">
                                <i class="menu-objects"></i> 
                                <span class="nav-label">Объекты</span>
                            </router-link>
                        </li>

                        <li v-if="DisplayEquipments" :class="{active:path.match('/Equipment$')||path.match('/Equipment/')}">
                            <router-link to="/Equipment" title="Оборудование">
                                <i class="menu-equip"></i>
                                <span class="nav-label">Оборудование</span>
                            </router-link>
                        </li>

                        <li v-if="DisplayEquipmentLogs" :class="{active:path.match('/EquipmentJournals')}">
                            <router-link to="/EquipmentJournals" title="Журналы">
                                <i class="fa fa-book"></i>
                                <span class="nav-label">Журналы</span>
                            </router-link>
                        </li>

                        <li v-if="DisplayVulnerabilities" :class="{active:path.match('/Vulnerabilities')}">
                            <router-link to="/Vulnerabilities" title="Уязвимости"><i class="fa fa-bug"></i> <span class="nav-label">Уязвимости</span></router-link>
                        </li>
                        <li v-if="DisplayKnowledgeBase" :class="{active:path.match('/KnowledgeBase')}">
                            <router-link to="/KnowledgeBase" title="База знаний"><i class="fa fa-graduation-cap"></i> <span class="nav-label">База знаний</span></router-link>
                        </li>
                        <li v-if="DisplayPost">
                            <a asp-action="Index" asp-controller="Post" title="Почта">
                                <i class="fa fa-envelope"></i> <span class="nav-label">Почта</span>
                                <span class="label label-warning" style="line-height: 12px;padding: 2px 3px;position: absolute;right: 9px;top: 12px;display: inline;">16</span>
                            </a>
                        </li>
                        <li v-if="DisplayMessages">
                            <a asp-action="Index" asp-controller="Message" title="Сообщения">
                                <i class="fa fa-bell"></i> <span class="nav-label">Сообщения</span>
                                <span class="label label-primary" style="line-height: 12px;padding: 2px 3px;position: absolute;right: 11px;top: 12px;display: inline;">8</span>
                            </a>
                        </li>
                        <li v-if="DisplayDictionaries && !IsAdmin" :class="{active:path.match('/Dictionaries')}">
                            <router-link to="/Dictionaries" title="Справочники"><i class="fa fa-sitemap"></i> <span class="nav-label">Справочники</span></router-link>
                        </li>


                        <li v-if="DisplayCompanyCard" :class="{active:path.match('/CompanyCard')}">
                            <router-link to="/CompanyCard" title="Карточка копании"><i class="fa fa-building"></i> <span class="nav-label">Карточка копании</span></router-link>
                        </li>

                    </template>

					<!-- Группа администрирование -->

					<template v-if="IsAdmin || IsCompanyAdmin">
						<li :class="{active:path.match('/LogAction')||path.match('/Users')||path.match('/Dictionaries')||path.match('/Companies')}">
							<a title="Администрирование"><i class="fa fa-cogs"></i> <span class="nav-label">Администрирование</span></a>
                            <ul class="nav nav-second-level">
                                <li>
                                    <router-link to="/LogAction" title="Журнал действий"><i class="fa fa-book"></i> Журнал действий</router-link>
                                </li>
                                <li>
                                    <router-link to="/Users" id="auser" title="Пользователи" class="dfleximp"><i class="menu-user"></i> Пользователи</router-link>
                                </li>
                                <li v-if="DisplayDictionaries">
                                    <router-link to="/Dictionaries" title="Справочники"><i class="fa fa-sitemap"></i> Справочники</router-link>
                                </li>
                                <li v-if="DisplayCompanies" >
                                    <router-link to="/Companies" title="Компании"><i class="fa fa-building"></i> Компании</router-link>
                                </li>

                                <li v-if="DisplayTariffs" >
                                    <router-link to="/Tariffs" title="Тарифы"><i class="fa fa-money"></i> Тарифы</router-link>
                                </li>
                            </ul>
						</li>

					</template>


					<li class="navbar-header posinh">
						<a class="navbar-minimalize minimalize-styl-2 btn collapse_menu" href="#"><i class="fa fa-bars"></i><span class="nav-label font13">Скрыть меню</span></a>
					</li>

					<li class="enter_style">
						<template v-if="IsAuthenticated">
							<a href="Login/SignOut" title="Выход">
								<i class="fa fa-sign-out fa-lg"></i><span class="nav-label">Выход</span>
							</a>
						</template>
						<template v-else>
							<router-link to="/Login" title="Вход">
								<i class="fa fa-sign-in fa-lg"></i> <span class="nav-label">Вход</span>
							</router-link>
						</template>
					</li>

					<li class="sborka">
						<a href="" title="Написать в тех.поддержку" id="tsupport"><i class="fa fa-pencil mr5" aria-hidden="true"></i><span class="nav-label mr5">Тех.поддержка </span><span class="text-info font10 d-block fontch">({{Assembly}})</span></a>
					</li>

				</ul>
			</div>
		</nav>
		<!--Чтобы иконки не мелькали, подгружаю белые варианты. Не удалять!-->
		<img style="display:none;" src="img/objectsw.png" /><img style="display:none;" src="img/equipw.png" /><img style="display:none;" src="img/userw.png" />


		<div id="page-wrapper" class="white-bg dashbard-1">
			<div class="row">
				<div class="col-lg-12 pleft0 pright0 h100">
					<div id="app_small" class="text-center">
						<router-link to="/"><img :src="Settings.Logo.PortalLogo" class="imglogosmall"></router-link>
						<h1 class="display-4-small mt0 mb0 flexgrow">
							{{ Settings.Logo.PortalTitle }}
						</h1>
						<a class="navbar-minimalize minimalize-styl-2 btn smallhide" href="#"><i class="fa fa-bars"></i></a>
					</div>
					<div class="wrapper wrapper-content wrapper-content-auto">
						<div class="row no-margins">
							<transition>
								<router-view />
							</transition>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>
<script src="./Entry.ts" lang="ts">
</script>
 
