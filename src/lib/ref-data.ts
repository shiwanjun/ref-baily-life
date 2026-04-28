import categoriesData from '$lib/categories.json';
import settingsData from '$lib/settings.json';
import sitesData from '$lib/sites.json';

export type CategoryName = string;

export type Category = {
	name: CategoryName;
	description: string;
	sort?: number;
};

export type Site = {
	id: number;
	name: string;
	url: string;
	logo: string;
	catelog: string;
	desc: string;
	sort: number;
	hide: number;
	category: CategoryName;
	tags: string[];
	featured: number;
};

type RawSite = {
	id: number;
	name: string;
	url: string;
	logo: string;
	catelog: string;
	desc: string;
	sort: number;
	hide: number;
};

export const categories: Category[] = (categoriesData as Category[]).map((category) => ({
	name: category.name,
	description: category.description ?? '',
	sort: category.sort
}));

export const categoryNames = categories.map((category) => category.name);

const categoryById = new Map<number, CategoryName>([
	[1, '返现购物'],
	[2, '返现购物'],
	[3, '银行开户'],
	[4, '银行开户'],
	[5, '银行开户'],
	[6, '银行开户'],
	[7, '银行开户'],
	[8, '银行开户'],
	[9, '银行开户'],
	[10, '银行开户'],
	[11, '信用卡申请'],
	[12, '信用卡申请'],
	[13, '信用卡申请'],
	[14, '信用卡申请'],
	[15, '信用卡申请'],
	[16, '信用卡申请'],
	[17, '信用卡申请'],
	[18, '信用卡申请'],
	[19, '银行开户'],
	[20, '券商与交易所'],
	[21, '券商与交易所'],
	[22, '券商与交易所'],
	[23, '券商与交易所'],
	[24, '券商与交易所'],
	[25, '券商与交易所'],
	[26, '券商与交易所'],
	[27, '券商与交易所'],
	[28, '券商与交易所'],
	[29, '券商与交易所'],
	[30, '券商与交易所'],
	[31, '券商与交易所'],
	[32, '券商与交易所'],
	[33, '券商与交易所'],
	[34, '支付汇款与钱包'],
	[35, '支付汇款与钱包'],
	[36, '支付汇款与钱包'],
	[37, '支付汇款与钱包'],
	[38, '支付汇款与钱包'],
	[39, '支付汇款与钱包'],
	[40, '支付汇款与钱包'],
	[41, '支付汇款与钱包'],
	[42, 'eSIM 通信与地址'],
	[43, 'eSIM 通信与地址'],
	[44, 'eSIM 通信与地址'],
	[45, 'eSIM 通信与地址'],
	[46, '旅行与理赔'],
	[47, '旅行与理赔'],
	[48, 'eSIM 通信与地址'],
	[49, 'eSIM 通信与地址'],
	[50, '数字服务与好物'],
	[51, '数字服务与好物'],
	[52, '数字服务与好物'],
	[53, '数字服务与好物'],
	[54, '数字服务与好物'],
	[55, '数字服务与好物'],
	[56, '数字服务与好物'],
	[57, '数字服务与好物'],
	[58, '数字服务与好物'],
	[59, '支付汇款与钱包'],
	[60, '数字服务与好物'],
	[61, '数字服务与好物'],
	[62, '数字服务与好物'],
	[63, '数字服务与好物'],
	[64, '银行开户'],
	[65, '支付汇款与钱包']
]);

const featuredIds = new Set([2, 1, 46, 49, 34, 15]);

export const settings = settingsData[0] ?? { title: '贝利说TV' };

export function buildTags(site: Pick<RawSite, 'name' | 'desc' | 'url' | 'catelog'>) {
	const text = `${site.name} ${site.desc} ${site.url} ${site.catelog}`.toLowerCase();
	const tags = new Set<string>();

	if (/美国|amex|chase|capital|sofi|varomoney|fidelity|schwab|ibkr|rakuten|topcashback|tello|anytimemailbox|okx美国|kraken美国|moomoo/.test(text)) tags.add('美国');
	if (/中国|民生|农业|兴业|教育邮箱|微信|小程序/.test(text)) tags.add('中国');
	if (/香港|港币|za|渣打|汇丰/.test(text)) tags.add('香港');
	if (/欧洲|n26|revolut|kraken欧洲|bybit-欧洲/.test(text)) tags.add('欧洲');
	if (/新加坡|长桥/.test(text)) tags.add('新加坡');
	if (/全球|wise|lemfi|xesim|esim|redteago|bitget|bybit-全球/.test(text)) tags.add('全球');

	if (/信用卡|amex|chase|csr|csp|ink|白金|团办/.test(text)) tags.add('信用卡');
	if (/银行|开户|支票|checking|capital one|sofi|varo|n26|ifast|蚂蚁/.test(text)) tags.add('开户奖励');
	if (/证券|券商|股票|ibkr|schwab|fidelity|moomoo|长桥/.test(text)) tags.add('券商');
	if (/binance|okx|bybit|bitget|kraken|火币|合约|c2c|钱包|冷钱包|热钱包|ether/.test(text)) tags.add('加密');
	if (/esim|流量|运营商|tello|1psim|kitesim|红茶|xesim/.test(text)) tags.add('通信');
	if (/汇款|支付|paypal|wise|revolut|lemfi/.test(text)) tags.add('支付汇款');
	if (/优惠码|9折|九折|折扣|邀请码/.test(text)) tags.add('优惠码');
	if (/理赔|airhelp|延误/.test(text)) tags.add('航空理赔');
	if (/虚拟|会员|影视|邮箱|拼车|notion|大模型|语音|meta|小程序|加速器|minimax|typeless|cocoduck/.test(text)) tags.add('数字服务');

	if (/必须美国|美国us|需美国|本地才能激活|itin|联系|客户经理|不要买多/.test(text)) tags.add('注意条件');

	return Array.from(tags).slice(0, 5);
}

export function enrichSite(site: RawSite & Partial<Pick<Site, 'category' | 'tags' | 'featured'>>) {
	return {
		...site,
		category: site.category ?? categoryById.get(site.id) ?? '数字服务与好物',
		tags: site.tags ?? buildTags(site),
		featured: site.featured ?? (featuredIds.has(site.id) ? 1 : 0)
	} satisfies Site;
}

export const fallbackAllSites: Site[] = (sitesData as RawSite[]).map(enrichSite);

export const fallbackSites: Site[] = fallbackAllSites.filter((site) => !site.hide);
