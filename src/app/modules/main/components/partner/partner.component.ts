import { Component, OnInit } from '@angular/core';

export interface Essence {
	name: string;
	location: string;
	nature: string;
	characteristic: string;
	screenshots: [string];
	infoImage: string;
	iconImage: string;
	iconHoverImage:string;
}


@Component({
	selector: 'app-partner',
	templateUrl: './partner.component.html',
	styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

	essences: [Essence] = [
		{
			name: '爱因斯坦',
			location: '美洲',
			nature: '古灵精怪的老头，喜欢教育小朋友，虽然博学却非常自卑，不喜欢和他人接触。总是幻想有人要迫害他或是想抢走他的劳动成果，不信任任何人。同时他又很单纯，对学术研究近乎痴迷，只要提到物理相关的话题他就会变得滔滔不绝，兴奋地和你聊起来。',
			characteristic: '科学怪人形象，会使用E=MC^2光波冲击魔法，物理和法术攻击能力强。',
			screenshots: [
				'/assets/images/partner_einstein/1.png',
				'/assets/images/partner_einstein/2.png',
				'/assets/images/partner_einstein/3.png'
			],
			infoImage: '/assets/images/partner_einstein/main.png',
			iconImage: '/assets/images/partner_avator/Einstein.png',
			iconHoverImage: '/assets/images/partner_avator_hover/Einstein.png'
		},
		{
			name: '华盛顿',
			location: '美洲',
			nature: '从小就有破坏欲，想要砍倒一切比他高的物体。喜欢收藏各种武器，但是由于经济条件不好，常常四处跟人借钱。他为人正直，不容许有任何道德败坏的事情发生，对自己和他人都很严格。打仗时喜欢避开敌人的锋芒，常常采取偷袭和游击的策略。',
			characteristic: '拿着一把斧头，武器攻击强。',
			screenshots: [
				'/assets/images/partner_washington/1.png',
				'/assets/images/partner_washington/2.png',
				'/assets/images/partner_washington/3.png'
			],
			infoImage: '/assets/images/partner_washington/main.png',
			iconImage: '/assets/images/partner_avator/Washington.png',
			iconHoverImage: '/assets/images/partner_avator_hover/Washington.png'
		},
		{
			name: '迈克杰克逊',
			location: '美洲',
			nature: '表面是一个阳光、活力四射的青年，其实内心比较阴暗，喜欢争强好胜，爱计较得失。每次表演前都要把所有准备物资查看一遍，是一个完美主义者，不容许任何纰漏发生。台上、台下双面人格，总是戴着虚伪的面具。',
			characteristic: '擅长使用脚类攻击技能',
			screenshots: [
				'/assets/images/partner_mj/1.png',
				'/assets/images/partner_mj/2.png',
				'/assets/images/partner_mj/3.png'
			],
			infoImage: '/assets/images/partner_mj/main.png',
			iconImage: '/assets/images/partner_avator/MJ.png',
			iconHoverImage: '/assets/images/partner_avator_hover/MJ.png'
		},
		{
			name: '印第安酋长',
			location: '美洲',
			nature: '老实敦厚不善言谈，只要不触及他的底线，平时都是比较友善的。他喜欢没事就在那舞刀弄剑，如果你胆敢出言不逊或挑战他的权威，他会毫不犹豫地冲向你，然后教你怎么做人。',
			characteristic: '擅长使用回旋镖、长矛等武器，身体强壮，物理防御强，法术防御弱。',
			screenshots: [
				'/assets/images/partner_chief/1.png',
				'/assets/images/partner_chief/2.png',
				'/assets/images/partner_chief/3.png'
			],
			infoImage: '/assets/images/partner_chief/main.png',
			iconImage: '/assets/images/partner_avator/Cheif.png',
			iconHoverImage: '/assets/images/partner_avator_hover/Cheif.png'
		},
		{
			name: '迪士尼',
			location: '美洲',
			nature: '一个热爱小动物的男生，平时喜欢变变魔术，性格固执不听劝，总爱幻想自己有一天能成为国王，说话很有仪式感，会反击一切质疑他的声音。虽然他贫困潦倒，但是富有爱心，能跟动物们有心灵感应式的沟通。',
			characteristic: '拥有城堡，物理防御极强，擅长法术。',
			screenshots: [
				'/assets/images/partner_disney/1.png',
				'/assets/images/partner_disney/2.png',
				'/assets/images/partner_disney/3.png'
			],
			infoImage: '/assets/images/partner_disney/main.png',
			iconImage: '/assets/images/partner_avator/Disney.png',
			iconHoverImage: '/assets/images/partner_avator_hover/Disney.png'
		},
		{
			name: '特斯拉',
			location: '美洲',
			nature: '非常聪明，往往你一开口他就明白你要说什么，然后无情地打断你，并嘲讽你太笨了。极度的自信对应着极度的自恋，相信自己能改变世界，不管是往好的方向或坏的方向都无所谓，看破了宇宙的玄机，不断寻求突破人类认知极限，是一个放荡不羁的科学家。',
			characteristic: '形象帅气，交流电、球形闪电魔法攻击强，物理攻击弱。',
			screenshots: [
				'/assets/images/partner_tesla/1.png',
				'/assets/images/partner_tesla/2.png',
				'/assets/images/partner_tesla/3.png'
			],
			infoImage: '/assets/images/partner_tesla/main.png',
			iconImage: '/assets/images/partner_avator/Tesla.png',
			iconHoverImage: '/assets/images/partner_avator_hover/Tesla.png'
		},
		{
			name: '乔帮主',
			location: '美洲',
			nature: '作为一个佛教徒，他清心寡欲不问世事，每天只想着如何挣更多的钱。如果你对他的产品感兴趣，他会用尽办法忽悠你来购买，如果你没钱，他会让你赶快走开。能说会道的他却情商不高，只顾及自己的感受，非常自我。',
			characteristic: '有Ipad, Iphone远程攻击, Ipad盾，物理法术攻击强，物理法术防御弱；',
			screenshots: [
				'/assets/images/partner_jobs/1.png',
				'/assets/images/partner_jobs/2.png',
				'/assets/images/partner_jobs/3.png'
			],
			infoImage: '/assets/images/partner_jobs/main.png',
			iconImage: '/assets/images/partner_avator/Jobs.png',
			iconHoverImage: '/assets/images/partner_avator_hover/Jobs.png'
		}
	];

	nowShowEssence: Essence = this.essences[0];
	nowIndex = 0;

	constructor() {

	}

	ngOnInit() {
		//console.log(this.essences);
	}

	changeEssence(index: number) {
		this.nowShowEssence = this.essences[index];
		this.nowIndex = index;
	}

}
