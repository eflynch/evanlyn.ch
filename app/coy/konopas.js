/**
 * KonOpas -- http://konopas.org/ & https://github.com/eemeli/konopas
 * Copyright (c) 2013-2015 by Eemeli Aro <eemeli@gmail.com>
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * The software is provided "as is" and the author disclaims all warranties
 * with regard to this software including all implied warranties of
 * merchantability and fitness. In no event shall the author be liable for
 * any special, direct, indirect, or consequential damages or any damages
 * whatsoever resulting from loss of use, data or profits, whether in an
 * action of contract, negligence or other tortious action, arising out of
 * or in connection with the use or performance of this software.
 * @license
 */
"use strict";
(function(G){G['i18n']={lc:{"en":function(n){return n===1?"one":"other"}},
c:function(d,k){if(!d)throw new Error("MessageFormat: Data required for '"+k+"'.")},
n:function(d,k,o){if(isNaN(d[k]))throw new Error("MessageFormat: '"+k+"' isn't a number.");return d[k]-(o||0)},
v:function(d,k){i18n.c(d,k);return d[k]},
p:function(d,k,o,l,p){i18n.c(d,k);return d[k] in p?p[d[k]]:(k=i18n.lc[l](d[k]-o),k in p?p[k]:p.other)},
s:function(d,k,p){i18n.c(d,k);return d[k] in p?p[d[k]]:p.other}}
i18n["en"]={
"Program":function(d){return "Programme"},
"weekday_n":function(d){return i18n.p(d,"N",0,"en",{"0":"Sunday","1":"Monday","2":"Tuesday","3":"Wednesday","4":"Thursday","5":"Friday","6":"Saturday","other":"???"})},
"weekday_short_n":function(d){return i18n.p(d,"N",0,"en",{"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat","other":"???"})},
"month_n":function(d){return i18n.p(d,"N",0,"en",{"0":"January","1":"February","2":"March","3":"April","4":"May","5":"June","6":"July","7":"August","8":"September","9":"October","10":"November","11":"December","other":"???"})},
"time_diff":function(d){return i18n.v(d,"T")+" "+i18n.p(d,"T_UNIT",0,"en",{"0":"seconds","1":"minutes","2":"hours","3":"days","4":"weeks","5":"months","6":"years","other":"???"})+" "+i18n.s(d,"T_PAST",{"true":"ago","other":"from now"})},
"search_example":function(d){return "For example, you could try <b>"+i18n.v(d,"X")+"</b>"},
"no_ko_id":function(d){return "No ID set! Please assign konopas_set.id a unique identifier."},
"old_browser":function(d){return "Unfortunately, your browser doesn't support some of the Javascript features required by KonOpas. To use, please try a different browser."},
"item_not_found":function(d){return "Programme id <b>"+i18n.v(d,"ID")+"</b> not found!"},
"item_tags":function(d){return i18n.s(d,"T",{"tags":"Tags","track":"Track","type":"Type","other":i18n.v(d,"T")})},
"star_export_this":function(d){return "Your current selection is encoded in <a href=\""+i18n.v(d,"THIS")+"\" target=\"_blank\">this page's URL</a>, which you may open elsewhere to share your selection."},
"star_export_share":function(d){return "For easier sharing, you can also generate a <a href=\""+i18n.v(d,"SHORT")+"\">shorter link</a> or a <a href=\""+i18n.v(d,"QR")+"\">QR code</a>."},
"star_import_this":function(d){return "Your previously selected items are shown with a highlighted interior, while those imported via <a href=\""+i18n.v(d,"THIS")+"\">this link</a> have a highlighted border."},
"star_import_diff":function(d){return "Your previous selection "+i18n.p(d,"PREV",0,"en",{"0":"was empty","one":"had one item","other":"had "+i18n.n(d,"PREV")+" items"})+", and the imported selection has "+i18n.p(d,"NEW",0,"en",{"0":"no new items","one":"one new item","other":i18n.n(d,"NEW")+" new items"})+" "+i18n.p(d,"SAME",0,"en",{"0":"","one":"and one which was already selected","other":"and "+i18n.n(d,"SAME")+" which were already selected"})+"."},
"star_import_bad":function(d){return i18n.p(d,"BAD",0,"en",{"0":"","one":"One of the imported items had an invalid ID.","other":i18n.n(d,"BAD")+" of the imported items had invalid IDs."})},
"star_set":function(d){return "Set my selection to the imported selection"},
"add_n":function(d){return "add "+i18n.v(d,"N")},
"discard_n":function(d){return "discard "+i18n.v(d,"N")},
"star_add":function(d){return "Add the "+i18n.p(d,"N",0,"en",{"one":"new item","other":i18n.n(d,"N")+" new items"})+" to my selection"},
"star_export_link":function(d){return "<a href=\""+i18n.v(d,"URL")+"\">Export selection</a> ("+i18n.p(d,"N",0,"en",{"one":"one item","other":i18n.n(d,"N")+" items"})+")"},
"star_hint":function(d){return "To \"star\" a programme item, click on the square next to it. Your selections will be remembered, and shown in this view. You currently don't have any programme items selected, so this list is empty."},
"star_no_memory":function(d){return i18n.s(d,"WHY",{"FFcookies":"It looks like you're using a Firefox browser with cookies disabled, so ","IOSprivate":"It looks like you're using an iOS or Safari browser in private mode, so ","other":"For some reason,"})+" your <a href=\"http://en.wikipedia.org/wiki/Web_storage\">localStorage</a> is not enabled, and therefore your selection will not be remembered between sessions. "+i18n.s(d,"SERVER",{"true":"Please <span class=\"js-link\" onclick=\"var e=_el('login-popup-link');if(e)e.click();\">login</span> to enable persistent storage.","other":""})},
"filter_sum_id":function(d){return "Listing "+i18n.p(d,"N",0,"en",{"one":"one item: "+i18n.v(d,"TITLE"),"other":i18n.n(d,"N")+" items with id "+i18n.v(d,"ID")})},
"filter_sum":function(d){return "Listing "+i18n.p(d,"N",0,"en",{"one":"one","other":i18n.v(d,"ALL")+" "+i18n.n(d,"N")})+" "+i18n.s(d,"LIVE",{"undefined":"","other":"current and future"})+" "+i18n.v(d,"TAG")+" "+i18n.p(d,"N",0,"en",{"one":"item","other":"items"})+" "+i18n.s(d,"DAY",{"undefined":"","other":"on "+i18n.v(d,"DAY")+" "+i18n.s(d,"TIME",{"undefined":"","other":"after "+i18n.v(d,"TIME")})})+" "+i18n.s(d,"AREA",{"undefined":"","other":"in "+i18n.v(d,"AREA")})+" "+i18n.s(d,"Q",{"undefined":"","other":"matching the query "+i18n.v(d,"Q")})},
"day_link":function(d){return "Show "+i18n.v(d,"N")+" matching items from "+i18n.p(d,"D",0,"en",{"0":"Sunday","1":"Monday","2":"Tuesday","3":"Wednesday","4":"Thursday","5":"Friday","6":"Saturday","other":"???"})},
"hidden_link":function(d){return "Show "+i18n.v(d,"N")+" more matching items with an end time before "+i18n.v(d,"T")+" on "+i18n.p(d,"D",0,"en",{"0":"Sunday","1":"Monday","2":"Tuesday","3":"Wednesday","4":"Thursday","5":"Friday","6":"Saturday","other":"???"})},
"server_cmd_fail":function(d){return "The command \""+i18n.v(d,"CMD")+"\" failed."},
"post_author":function(d){return i18n.v(d,"N")+" posted…"},
"ical_login":function(d){return "To make your selection available in external calendars, please <span class=\"js-link\" onclick=\"var e=_el('login-popup-link');if(e)e.click();\">login</span>."},
"ical_link":function(d){return "Your selection is available as an iCal (.ics) calendar at:"},
"ical_hint":function(d){return "Note that changes you make in this guide may not show up immediately in your external calendar software."},
"ical_make":function(d){return "To view your selection in your calendar app, you may also <br class=\"wide-only\">"+i18n.v(d,"A_TAG")+"make it available</a> in iCal (.ics) calendar format"},
"login_why":function(d){return "Once you've verified your e-mail address, you'll be able to sync your data between different clients (including external calendars). After signing in, no information will be transmitted to these external services."}}
})(this);
function KonOpas(set) {
	this.id = '';
	this.lc = 'en';
	this.tag_categories = false;
	this.default_duration = 60;
	this.time_show_am_pm = false;
	this.abbrev_00_minutes = true; // only for am/pm time
	this.always_show_participants = false;
	this.max_items_per_page = 200;
	this.non_ascii_people = false; // setting true enables correct but slower sort
	this.people_per_screen = 100;
	this.use_server = false;
	this.log_messages = true;
	this.cache_refresh_interval_mins = 60;
	this.views = [ "star", "prog", "part", "info" ];
	if (typeof set == 'object') for (var i in set) this[i] = set[i];

	if (!this.log_messages) _log = function(){};
	if (i18n[this.lc]) {
		i18n.txt = function(key, data){ return key in i18n[this.lc] ? i18n[this.lc][key](data) : key; }.bind(this);
		i18n.translate_html(i18n[this.lc], 'data-txt');
	} else alert('Locale "' + this.lc + '" not found.');
	if (!this.id) alert(i18n.txt('no_ko_id'));
	if (!Array.prototype.indexOf || !Array.prototype.filter || !Array.prototype.map
		|| !Date.now || !('localStorage' in window)) alert(i18n.txt('old_browser'));

	this.store = new KonOpas.Store(this.id);
	this.stars = new KonOpas.Stars(this.id);
	this.server = this.use_server && KonOpas.Server && new KonOpas.Server(this.id, this.stars);
	this.item = new KonOpas.Item();
	this.info = new KonOpas.Info();
	window.onhashchange = this.set_view.bind(this);
	var pl = document.getElementsByClassName('popup-link');
	for (var i = 0; i < pl.length; ++i) pl[i].addEventListener('click', KonOpas.popup_open);
	if (_el('refresh')) window.addEventListener('load', this.refresh_cache.bind(this), false);
}

KonOpas.prototype.set_program = function(list, opt) { this.program = new KonOpas.Prog(list, opt); }
KonOpas.prototype.set_people = function(list) { this.people = new KonOpas.Part(list, this); }

KonOpas.prototype.set_view = function() {
	var view = window.location.hash.substr(1, 4), tabs = _el('tabs');
	if (!this.program || !this.program.list.length) {
		view = 'info';
		tabs.style.display = 'none';
		this.info.show();
		if (this.server) this.server.error('Programme loading failed!');
	} else {
		tabs.style.display = 'block';
		if (!this.people || !this.people.list.length) {
			tabs.classList.add('no-people');
			if (view == 'part') view = '';
		} else {
			tabs.classList.remove('no-people');
		}
		switch (view) {
			case 'part': this.people.show();  break;
			case 'star': this.stars.show();   break;
			case 'info': this.info.show();    break;
			default:     this.program.show(); view = 'prog';
		}
	}
	for (var i = 0; i < this.views.length; ++i) {
		document.body.classList[view == this.views[i] ? 'add' : 'remove'](this.views[i]);
	}
	if (_el('load_disable')) _el('load_disable').style.display = 'none';
}

KonOpas.prototype.refresh_cache = function() {
	var t_interval = this.cache_refresh_interval_mins * 60000,
	    cache = window.applicationCache;
	if (!t_interval || (t_interval < 0)) return;
	cache.addEventListener('updateready', function() {
		if (cache.status == cache.UPDATEREADY) {
			_el('refresh').classList.add('enabled');
			_el('refresh').onclick = function() { window.location.reload(); };
		}
	}, false);
	if (cache.status != cache.UNCACHED) {
		window.setInterval(function() { cache.update(); }, t_interval);
	}
}
KonOpas.Info = function() {
	this.lu = _el('last-updated');
	this.lu_time = 0;
	var self = this, cache_manifest = document.body.parentNode.getAttribute('manifest');
	if (this.lu && cache_manifest && ((location.protocol == 'http:') || (location.protocol == 'https:'))) {
		var x = new XMLHttpRequest();
		x.onload = function() {
			self.lu_time = new Date(this.getResponseHeader("Last-Modified"));
			self.show_updated();
		};
		x.open('GET', cache_manifest, true);
		x.send();
	}
	var cl = _el('info_view').getElementsByClassName('collapse');
	for (var i = 0; i < cl.length; ++i) {
		cl[i].onclick = KonOpas.toggle_collapse;
	}
}

KonOpas.Info.prototype.show_updated = function() {
	if (!this.lu || !this.lu_time) return;
	var span = this.lu.getElementsByTagName('span')[0];
	span.textContent = KonOpas.pretty_time_diff(this.lu_time);
	span.title = this.lu_time.toLocaleString();
	span.onclick = function(ev) {
		var self = (ev || window.event).target;
		var tmp = self.title;
		self.title = self.textContent;
		self.textContent = tmp;
	};
	this.lu.style.display = 'inline';
}

KonOpas.Info.prototype.show = function() {
	_el("prog_ls").innerHTML = "";
	this.show_updated();
}

KonOpas.Item = function() {
	_el('prog_ls').onclick = KonOpas.Item.list_click;
	if (_el('scroll_link')) {
		_el('scroll_link').onclick = function() { _el('top').scrollIntoView(); return false; };
		if (window.navigator && navigator.userAgent.match(/Android [12]/)) {
			_el('time').style.display = 'none';
			_el('scroll').style.display = 'none';
		} else {
			this.scroll = {
				'i': 0, 'top': 0,
				'day': '', 'day_txt': '',
				't_el': _el('time'), 's_el': _el('scroll'),
				'times': document.getElementsByClassName('new_time')
			};
			window.onscroll = this.scroll_time.bind(this);
		}
	}
}

KonOpas.Item.show_extra = function(item, id) {
	function _tags(it) {
		if (!it.tags || !it.tags.length) return '';
		var o = {};
		it.tags.forEach(function(t) {
			var cat = 'tags';
			var tgt = KonOpas.Prog.hash({'tag': t});
			var a = t.split(':');
			if (a.length > 1) { cat = a.shift(); t = a.join(':'); }
			var link = '<a href="' + tgt + '">' + t + '</a>'
			if (o[cat]) o[cat].push(link);
			else o[cat] = [link];
		});
		var a = []; for (var k in o) a.push(i18n.txt('item_tags', {'T':k}) + ': ' + o[k].join(', '));
		return '<div class="discreet">' + a.join('<br>') + '</div>\n';
	}
	function _people(it) {
		if (!it.people || !it.people.length) return '';
		var a = it.people.map(!konopas.people || !konopas.people.list.length
			? function(p) { return p.name; }
			: function(p) { return "<a href=\"#part/" + KonOpas.hash_encode(p.id) + "\">" + p.name + "</a>"; }
		);
		return '<div class="item-people">' + a.join(', ') + '</div>\n';
	}

	if (_el("e" + id)) return;
	var html = "";
	var a = konopas.program.list.filter(function(el) { return el.id == id; });
	if (a.length < 1) html = i18n.txt('item_not_found', {'ID':id});
	else {
		html = _tags(a[0]) + _people(a[0]);
		if (a[0].desc) html += "<p>" + a[0].desc;
		html += '<a href="#prog/id:' + a[0].id + '" class="permalink" title="' + i18n.txt('Permalink') + '"></a>';
	}
	var extra = _new_elem('div', 'extra');
	extra.id = 'e' + id;
	extra.innerHTML = html;

	var cal = _new_elem('div', 'callink');
	cal.onclick = function(e){
		var c = window.ics(uuid());
		var starttime = new Date(a[0].date + " " + a[0].time + " GMT+1");
		var endtime = new Date(a[0].date + "T" + a[0].time + " GMT+1");
		c.addEvent(a[0].title, a[0].desc, a[0].room, starttime, endtime);
		c.download("coy13-event");
		e.stopPropagation();
	}
	extra.appendChild(cal);
	item.appendChild(extra);
}

KonOpas.Item.new = function(it) {
// This function is horrible... why is it..

// namespace.functionName = function(data){
    
//     var state = new State();

//     namespace.functionName = function(data){
//         mutate(state); 			// mutate must be idempotent
//         return copy(state);
//     }
//     return functionName(data);
// }

// instead of...

// namespace.functionName = function(data){
//     var state = new State();
//     mutate(state) 			// mutate must be idempotent
//     return state;
// }

	function _loc_str(it) {
		var s = '';
		if (it.loc && it.loc.length) {
			s = it.loc[0];
			if (it.loc.length > 1) s += ' (' + it.loc.slice(1).join(', ') + ')';
		}
		if (it.mins && (it.mins != konopas.default_duration)) {
			if (s) s += ', ';
			s += KonOpas.pretty_time(it.time, konopas) + ' - ' + KonOpas.pretty_time(KonOpas.time_sum(it.time, it.mins), konopas);
		}
		return s;
	}
	var frame = _new_elem('div', 'item_frame');
	var star  = frame.appendChild(_new_elem('div', 'item_star'));
	var item  = frame.appendChild(_new_elem('div', 'item'));
	var title = item.appendChild(_new_elem('div', 'title'));
	// Hack to add Organizer element
	var org = item.appendChild(_new_elem('div', 'organizer'))
	var loc   = item.appendChild(_new_elem('div', 'loc'));

	

	KonOpas.Item.new = function(it) {
		star.id = 's' + it.id;
		item.id = 'p' + it.id;
		title.textContent = it.title;
		loc.textContent = _loc_str(it);
		org.textContent = it.organizer;

		// You have to assign it both ways because we are modifying
		// a single node that is closured in each time we call this
		// function before cloning it... This is horrible.
		if (it.isspecial){
			frame.className = "item_frame special";
		} else {
			frame.className = "item_frame";
		}
		return frame.cloneNode(true);
	};
	return KonOpas.Item.new(it);
}

KonOpas.Item.show_list = function(ls, opt) {
	var	_now = Date.now(),
		day_lengths = {}, day_links = {},
		frag = document.createDocumentFragment(),
		prev_date = '', prev_time = '',
		_list_item = function(p) {
			if (opt.day && p.date) {
				day_lengths[p.date] = (day_lengths[p.date] || 0) + 1;
			}
			if (opt.show_all || !opt.day || !p.date || (p.date == opt.day)) {
				if (this.hide_ended && p.t1 && (p.t1 < opt.now)) { ++opt.n_hidden; return; }
				if (p.date != prev_date) {
					prev_date = p.date;
					prev_time = '';
					frag.appendChild(_new_elem('div', 'new_day', KonOpas.pretty_date(p.t0 || p.date, konopas))).id = 'dt_' + p.date;
				}
				if (p.time != prev_time) {
					prev_time = p.time;
					frag.appendChild(document.createElement('hr'));
					frag.appendChild(_new_elem('div', 'new_time', KonOpas.pretty_time(p.t0 || p.time, konopas)))
						.setAttribute('data-day', p.date);
				}
				frag.appendChild(KonOpas.Item.new(p));
				++opt.n_listed;
			}
		};
	if (!opt) opt = {};
	opt.show_all = (ls.length <= konopas.max_items_per_page);
	opt.n_hidden = 0; opt.n_listed = 0;
	opt.now = new Date(_now + 10*60000 - _now % (10*60000));
	if (!opt.day || !konopas.program.days[opt.day]) {
		var day_now = KonOpas.data_date(opt.now);
		if (konopas.program.days[day_now]) opt.day = day_now;
		else { opt.day = ''; for (opt.day in konopas.program.days) break; }
	}
	if (ls.length > (opt.id ? 1 : 0)) {
		frag.appendChild(_new_elem('div', 'item_expander', '» '))
			.appendChild(_new_elem('a', 'js-link', i18n.txt('Expand all')))
			.id = 'item_expander_link';
	}
	ls.forEach(_list_item, {hide_ended:opt.hide_ended});
	if (!opt.n_listed && opt.n_hidden) {
		day_lengths = {};
		opt.n_hidden = 0; opt.n_listed = 0;
		prev_date = ''; prev_time = '';
		ls.forEach(_list_item, {hide_ended:false});
	}

	function _day_link(t) {
		var d = day_links[t],
		    txt = i18n.txt('day_link', {
				'N': day_lengths[d],
				'D': KonOpas.parse_date(d).getDay()
			}),
		    link = _new_elem('a', 'day-link js-link', txt);
		link.id = t + '_day_link';
		link.onclick = function() {
			if (t == 'next') window.scrollTo(0, 0);
			opt.day = d;
			KonOpas.Item.show_list(ls, opt);
		};
		return link;
	}
	function _hidden_link() {
		var	txt = i18n.txt('hidden_link', {
				'N': opt.n_hidden,
				'T': KonOpas.pretty_time(opt.now, konopas),
				'D': opt.now.getDay()
			}),
		    link = _new_elem('a', 'day-link js-link', txt);
		link.id = 'hidden_day_link';
		link.onclick = function() {
			opt.hide_ended = false;
			opt.day = KonOpas.data_date(opt.now);
			KonOpas.Item.show_list(ls, opt);
		};
		return link;
	}
	if (opt.day && !opt.show_all) for (var d in day_lengths) if (d in konopas.program.days) {
		if (d < opt.day) day_links['prev'] = d;
		else if ((d > opt.day) && !day_links['next']) day_links['next'] = d;
	}
	if (day_links['prev'] && !opt.n_hidden) frag.insertBefore(_day_link('prev'), frag.firstChild);
	if (day_links['next']) frag.appendChild(_day_link('next'));
	if (opt.n_hidden) frag.insertBefore(_hidden_link(), frag.firstChild);

	var LS = _el('prog_ls');
	while (LS.firstChild) LS.removeChild(LS.firstChild);
	LS.appendChild(frag);

	var expand_all = _el("item_expander_link");
	if (expand_all) expand_all.onclick = function() {
		var items = LS.getElementsByClassName("item");
		var exp_txt = i18n.txt('Expand all');
		if (expand_all.textContent == exp_txt) {
			for (var i = 0, l = items.length; i < l; ++i) {
				items[i].parentNode.classList.add("expanded");
				KonOpas.Item.show_extra(items[i], items[i].id.substr(1));
			}
			expand_all.textContent = i18n.txt('Collapse all');
		} else {
			for (var i = 0, l = items.length; i < l; ++i) {
				items[i].parentNode.classList.remove("expanded");
			}
			expand_all.textContent = exp_txt;
		}
	};

	var star_els = LS.getElementsByClassName("item_star");
	for (var i = 0, l = star_els.length; i < l; ++i) {
		star_els[i].onclick = function() { konopas.stars.toggle(this, this.id.substr(1)); return false; };
	}

	konopas.stars.list().forEach(function(s){
		var el = _el('s' + s);
		if (el) el.classList.add('has_star');
	});

	if (opt.id) {
		var it = document.getElementById('p' + opt.id);
		if (it) {
			it.parentNode.classList.add("expanded");
			KonOpas.Item.show_extra(it, opt.id);
			if (ls.length > 1) it.scrollIntoView();
		}
	}

	if (opt.prog_view) {
		var d_s = _el('day-sidebar'), d_n = _el('day-narrow'),
		    d_click = function(ev) {
				var li = (ev || window.event).target,
				    d = li.getAttribute('data-day');
				if (!d) return;
				opt.day = d;
				if (opt.show_all) {
					var dt = _el('dt_' + d);
					if (dt) {
						dt.scrollIntoView();
						KonOpas.Prog.focus_day(d);
					} else if (d < KonOpas.data_date(opt.now)) {
						opt.hide_ended = false;
						KonOpas.Item.show_list(ls, opt);
					}
				} else {
					opt.hide_ended = true;
					KonOpas.Item.show_list(ls, opt);
				}
			},
		    d_set = function(div, len) {
				var ul = document.createElement('ul');
				ul.className = 'day-list';
				ul.onclick = d_click;
				for (var d in konopas.program.days) {
					var li = document.createElement('li');
					li.textContent = konopas.program.days[d][len] + ' (' + (day_lengths[d] || 0) + ')';
					li.setAttribute('data-day', d);
					if (d == opt.day) li.className = 'selected';
					ul.appendChild(li);
				}
				div.innerHTML = '';
				div.appendChild(ul);
			};
		if (d_s) d_set(d_s, 'long');
		if (d_n) d_set(d_n, 'short');
		konopas.program.show_filter_sum(ls, opt);
	}

	konopas.item.scroll.i = 0;
	window.onscroll && window.onscroll();
}

KonOpas.Item.list_click = function(ev) {
	var el = (ev || window.event).target,
	    is_link = false;
	while (el && !/\bitem(_|$)/.test(el.className)) {
		if (el.id == 'prog_ls') return;
		if ((el.tagName.toLowerCase() == 'a') && el.href) is_link = true;
		el = el.parentNode;
		if (!el) return;
	}
	if (el && el.id && (el.id[0] == 'p') && !is_link) {
		if (el.parentNode.classList.toggle("expanded")) {
			KonOpas.Item.show_extra(el, el.id.substr(1));
		}
	}
}

KonOpas.Item.prototype.scroll_time = function() {
	var S = this.scroll,
		st_len = S.times.length,
	    scroll_top = window.pageYOffset + 20; // to have more time for change behind new_time
	if (!S.t_el || !st_len) return;
	if (scroll_top < S.times[0].offsetTop) {
		S.i = 0;
		S.top = S.times[0].offsetTop;
		S.t_el.style.display = 'none';
		var day0 = S.times[0].getAttribute('data-day');
		if (day0 != S.day) {
			KonOpas.Prog.focus_day(day0);
			S.day = day0;
		}
	} else {
		var i = S.top ? S.i : 1;
		if (i >= st_len) i = st_len - 1;
		if (scroll_top > S.times[i].offsetTop) {
			while ((i < st_len) && (scroll_top > S.times[i].offsetTop)) ++i;
			--i;
		} else {
			while ((i >= 0) && (scroll_top < S.times[i].offsetTop)) --i;
		}
		if (i < 0) i = 0;
		if ((i == 0) || (i != S.i)) {
			S.i = i;
			S.top = S.times[i].offsetTop;
			var day0 = S.times[i].getAttribute('data-day'),
			    day1 = ((i + 1 < st_len) && S.times[i+1].getAttribute('data-day')) || day0;
			S.t_el.textContent = konopas.program.days[day0]['short'] + '\n' + S.times[i].textContent;
			S.t_el.style.display = 'block';
			if (day1 != S.day) {
				KonOpas.Prog.focus_day(day1);
				S.day = day1;
			}
		}
	}
	if (S.s_el) S.s_el.style.display = S.t_el.style.display;
}
KonOpas.Part = function(list, opt) {
	this.list = list || [];
	this.list.forEach(function(p){
		p.sortname = ((p.name[1] || '') + '  ' + p.name[0]).toLowerCase().replace(/^[\s/()]+/, '');
		if (!opt.non_ascii_people) p.sortname = p.sortname.make_ascii();
	});
	this.list.sort(opt.non_ascii_people
		? function(a, b) { return a.sortname.localeCompare(b.sortname, opt.lc); }
		: function(a, b) { return a.sortname < b.sortname ? -1 : a.sortname > b.sortname; });
	this.set_ranges(opt.people_per_screen || 0);
}

KonOpas.Part.prototype.set_ranges = function(bin_size) {
	var	self = this,
		_ranges = function(a, bin_size) {
			var	ends = [], start = ' ',
				n_bins = bin_size ? Math.round(a.length / bin_size) : 0,
				_prev_matches = function(a, i) { return (i > 0) && (a[i - 1] == a[i]); },
				_next_matches = function(a, i) { return (i < a.length - 1) && (a[i + 1] == a[i]); };
			for (var i = 1; i <= n_bins; ++i) {
				var e = Math.round(i * a.length / n_bins), n_up = 0, n_down = 0;
				if (e < 0) e = 0;
				if (e >= a.length) e = a.length - 1;
				while (_next_matches(a, e + n_up)) ++n_up;
				if (n_up) while (_prev_matches(a, e - n_down)) ++n_down;
				if (n_up <= n_down) e += n_up;
				else if (e > n_down) e -= n_down + 1;
				if (!ends.length || (ends[ends.length - 1] != a[e])) ends.push(a[e]);
			}
			ends.forEach(function(e, i){
				if (e > start) ends[i] = start + e;
				if (e >= start) start = String.fromCharCode(e.charCodeAt(0) + 1);
			});
			return ends;
		},
		_range_set = function(div, nr) {
			var ul = _new_elem('ul', 'name-list');
			nr.forEach(function(n){
				var startChar = n.charAt(0);
				if (startChar == ' ') startChar = 'A';
				var li = _new_elem('li', '', startChar);
				if (n.length > 1) li.textContent += ' - ' + n.charAt(1);
				li.setAttribute('data-range', n);
				ul.appendChild(li);
			});
			div.appendChild(ul);
			div.onclick = (function(ev) {
				var name_range = (ev || window.event).target.getAttribute('data-range');
				if (name_range) {
					konopas.store.set('part', { 'name_range': name_range, 'participant': '' });
					window.location.hash = '#part';
					this.update_view(name_range, '');
				}
			}).bind(self);
		},
		_firstletter = function(name) {
			return name.replace(/^[\s/(]+/, '').charAt(0).toUpperCase()
		}

	var fn = [], ln = [];

	this.list.forEach(function(p){
		if (p.name && p.name.length) {
			fn.push(_firstletter(p.name[0]));
			if (p.name.length >= 2) ln.push(_firstletter(p.name[1]) || _firstletter(p.name[0]));
		}
	});

	this.ranges = _ranges(ln.length ? ln : fn, bin_size);
	_range_set(_el('part-sidebar'), this.ranges);
	_range_set(_el('part-narrow'), this.ranges);

	var nl_type =  fn.length &&  ln.length ? ''
	            :  fn.length && !ln.length ? 'fn-only'
	            : !fn.length &&  ln.length ? 'ln-only'
	            : 'error';
	if (nl_type) _el('part_names').classList.add(nl_type);
}

KonOpas.Part.name_in_range = function(n0, range) {
	switch (range.length) {
		case 1:  return (n0 == range[0]);
		case 2:  return konopas.non_ascii_people
			? (n0.localeCompare(range[0], konopas.lc) >= 0) && (n0.localeCompare(range[1], konopas.lc) <= 0)
			: ((n0 >= range[0]) && (n0 <= range[1]));
		default: return (range.indexOf(n0) >= 0);
	}
}

KonOpas.Part.prototype.show_one = function(i) {
	var p = this.list[i],
	    p_name = KonOpas.clean_name(p, false),
	    links = '',
	    img = '',
	    pl = KonOpas.clean_links(p);
	if (pl) {
		links += '<dl class="linklist">';
		for (var type in pl) if (type != 'img') {
			var tgt = pl[type].tgt, txt = pl[type].txt || tgt;
			links += '<dt>' + type + ':<dd>' + '<a href="' + tgt + '">' + txt + '</a>';
		}
		links += '</dl>';
		if (pl.img && navigator.onLine) {
			img = '<a class="part_img" href="' + pl.img.tgt + '"><img src="' + pl.img.tgt + '" alt="' + i18n.txt('Photo') + ': ' + p_name + '"></a>';
		}
	}
	_el("part_names").innerHTML = '';
	_el("part_info").innerHTML =
		  '<h2 id="part_title">' + p_name + '</h2>'
		+ ((p.bio || img) ? ('<p>' + img + p.bio) : '')
		+ links;
	KonOpas.Item.show_list(konopas.program.list.filter(function(it) { return p.prog.indexOf(it.id) >= 0; }));
	_el("top").scrollIntoView();
}

KonOpas.Part.prototype.show_list = function(name_range) {
	var lp = !name_range ? this.list : this.list.filter(function(p) {
		var n0 = p.sortname[0].toUpperCase();
		return KonOpas.Part.name_in_range(n0, name_range);
	});
	_el('part_names').innerHTML = lp.map(function(p) {
		return '<li><a href="#part/' + KonOpas.hash_encode(p.id) + '">' + KonOpas.clean_name(p, true) + '</a></li>';
	}).join('');
	_el('part_info').innerHTML = '';
	_el('prog_ls').innerHTML = '';
}

KonOpas.Part.prototype.update_view = function(name_range, participant) {
	var	p_id = participant.substr(1),
		ll = document.querySelectorAll('.name-list > li');
	if (!name_range) name_range = this.ranges && this.ranges[0] || '';
	for (var i = 0; i < ll.length; ++i) {
		var cmd = (ll[i].getAttribute('data-range') == name_range) ? 'add' : 'remove';
		ll[i].classList[cmd]('selected');
	}
	if (!p_id || !this.list.some(function(p,i){
		if (p.id == p_id) { this.show_one(i); return true; }
	}, this)) {
		participant = '';
		this.show_list(name_range);
	}
	konopas.store.set('part', { 'name_range': name_range, 'participant': participant });
}

KonOpas.Part.prototype.show = function(hash) {
	if (!this.list.length) { window.location.hash = ''; return; }
	var store = konopas.store.get('part') || {},
	    name_range = store.name_range || '',
	    participant = !document.body.classList.contains('part') && store.participant || '',
		hash = window.location.hash.substr(6);
	if (hash) {
		var p_id = KonOpas.hash_decode(hash);
		var pa = this.list.filter(function(p) { return p.id == p_id; });
		if (pa.length) {
			participant = 'p' + pa[0].id;
			var n0 = pa[0].sortname[0].toUpperCase();
			if (!n0 || !this.ranges || !this.ranges.some(function(r){
				if (KonOpas.Part.name_in_range(n0, r)) { name_range = r; return true; }
			})) name_range = '';
		} else {
			window.location.hash = '#part';
			return;
		}
	} else if (participant) {
		window.location.hash = '#part/' + participant.substr(1);
		return;
	}
	this.update_view(name_range, participant);
}
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}


if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
}


if ((function(){
	try { new Date().toLocaleDateString("i"); }
	catch (e) { return e.name !== "RangeError"; }
	return true;
})()) {
	Date.prototype._orig_toLocaleDateString = Date.prototype.toLocaleDateString;
	Date.prototype.toLocaleDateString = function(locale, options) {
		if (!arguments.length || (typeof i18n == 'undefined')) return this._orig_toLocaleDateString();
		var i = function(key, data){ return key in i18n[locale] ? i18n[locale][key](data) : key; },
		    w = i('weekday_n', { 'N': this.getDay() }),
		    d = this.getDate(),
		    m = i('month_n', { 'N': this.getMonth() }),
		    s = w + ', ' + d + ' ' + m;
		if (options && options.year) s += ' ' + this.getFullYear();
		return s;
	};
}


String.prototype.make_ascii = String.prototype.normalize
	? function() {
		return this.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
	}
	: function() {
		var str = this.toString();
		if (/^[\x00-\x7F]*$/.test(str)) return str;
		// map from http://web.archive.org/web/20120918093154/http://lehelk.com/2011/05/06/script-to-remove-diacritics/
		var norm_map = {
			'A': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
			'AA':/[\uA732]/g,
			'AE':/[\u00C6\u01FC\u01E2]/g,
			'AO':/[\uA734]/g,
			'AU':/[\uA736]/g,
			'AV':/[\uA738\uA73A]/g,
			'AY':/[\uA73C]/g,
			'B': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
			'C': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
			'D': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
			'DZ':/[\u01F1\u01C4]/g,
			'Dz':/[\u01F2\u01C5]/g,
			'E': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
			'F': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
			'G': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
			'H': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
			'I': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
			'J': /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
			'K': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
			'L': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
			'LJ':/[\u01C7]/g,
			'Lj':/[\u01C8]/g,
			'M': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
			'N': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
			'NJ':/[\u01CA]/g,
			'Nj':/[\u01CB]/g,
			'O': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
			'OI':/[\u01A2]/g,
			'OO':/[\uA74E]/g,
			'OU':/[\u0222]/g,
			'P': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
			'Q': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
			'R': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
			'S': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
			'T': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
			'TZ':/[\uA728]/g,
			'U': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
			'V': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
			'VY':/[\uA760]/g,
			'W': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
			'X': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
			'Y': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
			'Z': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
			'a': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
			'aa':/[\uA733]/g,
			'ae':/[\u00E6\u01FD\u01E3]/g,
			'ao':/[\uA735]/g,
			'au':/[\uA737]/g,
			'av':/[\uA739\uA73B]/g,
			'ay':/[\uA73D]/g,
			'b': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
			'c': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
			'd': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
			'dz':/[\u01F3\u01C6]/g,
			'e': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
			'f': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
			'g': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
			'h': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
			'hv':/[\u0195]/g,
			'i': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
			'j': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
			'k': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
			'l': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
			'lj':/[\u01C9]/g,
			'm': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
			'n': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
			'nj':/[\u01CC]/g,
			'o': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
			'oi':/[\u01A3]/g,
			'ou':/[\u0223]/g,
			'oo':/[\uA74F]/g,
			'p': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
			'q': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
			'r': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
			's': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
			't': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
			'tz':/[\uA729]/g,
			'u': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
			'v': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
			'vy':/[\uA761]/g,
			'w': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
			'x': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
			'y': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
			'z': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
		};
		for (var l in norm_map) {
			str = str.replace(norm_map[l], l);
		}
		return str.replace(/[^\x00-\x7F]/g, '');
	};


/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2011-06-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

(function (view) {

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.className)
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.className = this.toString();
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function (token) {
	token += "";
	if (checkTokenAndGetIndex(this, token) === -1) {
		this.push(token);
		this._updateClassName();
	}
};
classListProto.remove = function (token) {
	token += "";
	var index = checkTokenAndGetIndex(this, token);
	if (index !== -1) {
		this.splice(index, 1);
		this._updateClassName();
	}
};
classListProto.toggle = function (token) {
	token += "";
	if (checkTokenAndGetIndex(this, token) === -1) {
		this.add(token);
	} else {
		this.remove(token);
	}
};
classListProto.toString = function () {
	return this.join(" ");
};
 
if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}
 
}(self));
 
}
KonOpas.Prog = function(list, opt) {
	function _sort(a, b) {
		if (!a.date != !b.date) return a.date ? -1 : 1;
		if (a.date < b.date) return -1;
		if (a.date > b.date) return  1;
		if (!a.time != !b.time) return a.time ? 1 : -1;
		if (a.time < b.time) return -1;
		if (a.time > b.time) return  1;
		if (a.loc && b.loc) {
			if (a.loc.length < b.loc.length) return -1;
			if (a.loc.length > b.loc.length) return  1;
			for (var i = a.loc.length - 1; i >= 0; --i) {
				if (a.loc[i] < b.loc[i]) return -1;
				if (a.loc[i] > b.loc[i]) return  1;
			}
		}
		return 0;
	}
	this.list = (list || []).sort(_sort);
	this.list.forEach(function(p) {
		if (p && p.date) {
			var d = p.date.split(/\D+/),
			    t = p.time && p.time.split(/\D+/) || [0,0],
				m = p.time && Number(p.mins || KonOpas.default_duration) || (!p.time && 24*60-1) || 0;
			p.t0 = new Date(d[0], d[1] - 1, d[2], t[0], t[1]);
			if (isNaN(p.t0)) delete p.t0;
			else p.t1 = new Date(p.t0.valueOf() + 60000 * m);
		}
	});
	var pf = _el('prog_filters');
	pf.onclick = KonOpas.Prog.filter_change;
	var pl = pf.getElementsByClassName('popup-link');
	for (var i = 0; i < pl.length; ++i) {
		pl[i].setAttribute('data-title', pl[i].textContent);
		pl[i].nextElementSibling.onclick = KonOpas.Prog.filter_change;
	}
	var sf = _el('search');
	if (sf) {
		sf.onsubmit = _el('q').oninput = KonOpas.Prog.filter_change;
		sf.onreset = function() { KonOpas.Prog.set_filters({}); };
	}
	this.init_filters(opt);
	var pt = _el('tab_prog'),
	    pa = pt && pt.getElementsByTagName('a');
	if (pa && pa.length) pa[0].onclick = function(ev) {
		if (window.pageYOffset && document.body.classList.contains('prog')) {
			window.scrollTo(0, 0);
			(ev || window.event).preventDefault();
		}
	};
}


// ------------------------------------------------------------------------------------------------ static

KonOpas.Prog.hash = function(f, excl) {
	var p = ['#prog'];
	if (f) ['id', 'area', 'tag', 'query'].forEach(function(k){
		var v = f[k + '_str'] || f[k];
		if (excl && excl[k] || !v || (v == 'all_' + k + 's')) return;
		if ((k == 'tag') && konopas.tag_categories) {
			var m = v.match(new RegExp('^(' + konopas.tag_categories.join('|') + '):(.*)'));
			if (m) { k = m[1]; v = m[2]; }
		}
		p.push(k + ':' + KonOpas.hash_encode(v));
	});
	return p.length > 1 ? p.join('/') : '#';
}

KonOpas.Prog.get_filters = function(hash_only) {
	var	filters = { 'area':'', 'tag':'', 'query':'', 'id':'' },
		h = window.location.toString().split('#')[1] || '',
		h_set = false,
		tag_re = konopas.tag_categories && konopas.tag_categories.length && new RegExp('^' + konopas.tag_categories.join('|') + '$');
	if (h.substr(0, 5) == 'prog/') {
		h.substr(5).split('/').forEach(function(p){
			var s = p.split(':');
			if ((s.length == 2) && s[0] && s[1]) {
				if (tag_re && tag_re.test(s[0])) {
					s[1] = p;
					s[0] = 'tag';
				}
				filters[s[0]] = KonOpas.hash_decode(s[1]);
				h_set = true;
			}
		});
	}
	if (!hash_only && !h_set && !document.body.classList.contains('prog')) {
		var store = konopas.store.get('prog');
		if (store) for (var k in store) {
			if (filters.hasOwnProperty(k)) filters[k] = store[k];
		}
	}
	return filters;
}

KonOpas.Prog.set_filters = function(f, silent) {
	if (silent && !(history && history.replaceState)) return false;
	if (f.id) f = { 'id': f.id };
	konopas.store.set('prog', f);
	var h = KonOpas.Prog.hash(f),
	    h_cur = window.location.toString().split('#')[1] || '';
	if (h_cur != h.substr(1)) {
		if (silent) {
			var loc = window.location.toString().split('#')[0] + h;
			history.replaceState({}, document.title, loc);
			window.onhashchange()
		} else {
			window.location.hash = h;
		}
		return true;
	}
	return false;
}

// read filters from url + ev -> set new hash
KonOpas.Prog.filter_change = function(ev) {
	ev = ev || window.event;
	var key, value;
	var silent = false;
	switch (ev.type) {
		case 'click':
			if (ev.target.tagName.toLowerCase() != 'li') return;
			var popups = ev.target.getElementsByClassName('popup');
			if (popups && popups.length) return;
			key = ev.target.parentNode.id.replace(/\d+$/, '');
			value = ev.target.id;
			switch (key) {
				case 'area': value = value.replace(/^a([^a-zA-Z])/, '$1'); break;
				case 'tag':  value = value.replace(/^t([^a-zA-Z])/, '$1'); break;
			}
			break;
		case 'submit':
			ev.preventDefault();
			// fallthrough
		case 'input':
			key = 'query';
			value = _el("q").value;
			silent = value.length > 1;
			break;
		default: return;
	}
	var filters = KonOpas.Prog.get_filters();
	filters[key] = value;
	if (filters['id'] && (key != 'id')) filters['id'] = '';
	KonOpas.Prog.set_filters(filters, silent);
}

KonOpas.Prog.focus_day = function(d) {
	for (var n in {'day-sidebar':1, 'day-narrow':1}) {
		var e = _el(n),
			s = e && e.getElementsByTagName('li');
		if (s) for (var i = 0; i < s.length; ++i) {
			var _d = s[i].getAttribute('data-day');
			s[i].classList[(_d == d) ? 'add' : 'remove']('selected');
		}
	}
}



// ------------------------------------------------------------------------------------------------ instance

KonOpas.Prog.prototype.init_filters = function(opt) {
	var filter_el = _el('prog_lists'), labels = {}, regexp = {};
	function _txt(s) {
		return i18n.txt(s.charAt(0).toUpperCase() + s.slice(1).replace('_',' '));
	}
	function _ul(id) {
		var e = document.createElement('ul');
		e.id = id;
		return e;
	}
	function _li(par, id, txt) {
		var e = document.createElement('li');
		e.id = /^[^a-zA-Z]/.test(id) ? par.id[0] + id : id
		if (!txt) txt = labels[id] || _txt(id);
		if (/^\s*$/.test(txt)) return;
		e.textContent = /^[\\^$]/.test(txt) ? txt.substr(1) : txt;
		if (regexp[id]) e.setAttribute('data-regexp', regexp[id]);
		par.appendChild(e);
	}
	function _compare(a, b) {
		var sf = function(s) { return (labels[s] || s.replace(/^[^:]+:/, '')).toLowerCase().replace(/^the /, ''); },
			af = function(s) { return s.match(/\d+|\D+/g).map(function(v) { return Number(v) || v; }); },
			_a = sf(a), _b = sf(b);
		if ((_a[0] == '$') != (_b[0] == '$')) return (_a < _b) ? 1 : -1; // $ == 0x24
		if (/\d/.test(_a) && /\d/.test(_b)) {
			var aa = af(_a), bb = af(_b);
			for (var i = 0; i < aa.length && i < bb.length; ++i) {
				if (aa[i] < bb[i]) return -1;
				if (aa[i] > bb[i]) return  1;
			}
			if (aa.length != bb.length) return aa.length < bb.length ? -1 : 1;
		} else {
			if (_a < _b) return -1;
			if (_a > _b) return  1;
		}
		return 0;
	}
	function _ul2(par, id, name, prefix, list) {
		var title = labels[name] || _txt(name),
		    root = document.createElement('li'),
		    link = _new_elem('div', 'popup-link', title + '…'),
		    ul = _new_elem('ul', 'popup');
		// Hack: To remove Room category listing
		if (konopas.hiddenFilterCategories.indexOf(title) !== -1){
			root.style="display:none";
		}
		link.setAttribute('data-title', link.textContent);
		link.addEventListener('click', KonOpas.popup_open);
		ul.id = id;
		ul.setAttribute('data-title', title);
		ul.addEventListener('click', KonOpas.Prog.filter_change);
		for (var i = 0; i < list.length; ++i) {
			var txt = labels[list[i]] || list[i].replace(prefix, '');
			_li(ul, list[i], txt);
		}
		root.appendChild(link);
		root.appendChild(ul);
		par.appendChild(root);
	}
	function _fill(id, items) {
		var i = 0, o = opt[id], ul = _ul(id);
		labels = o.labels || {};
		regexp = o.regexp || {};
		for (var r in regexp) items[r] = 1;
		_li(ul, 'all_' + id + 's');
		if (o.promote) for (i = 0; i < o.promote.length; ++i) {
			_li(ul, o.promote[i]);
			delete items[o.promote[i]];
		}
		if (o.exclude) {
			var re = new RegExp(o.exclude.join('|'));
			for (var t in items) if (re.test(t)) delete items[t];
		}
		if (o.min_count) {
			for (var t in items) if (items[t] < o.min_count) delete items[t];
		}
		var list = Object.keys(items).sort(_compare);
		if (o.categories) for (i = 0; i < o.categories.length; ++i) {
			var prefix = o.categories[i] + ':',
			    list_in = [], list_out = [];
			for (var j = 0; j < list.length; ++j) {
				if (list[j].substr(0, prefix.length) == prefix) {
					list_in.push(list[j]);
				} else {
					list_out.push(list[j]);
				}
			}
			switch (list_in.length) {
				case 0:   break;
				case 1:   _li(ul, prefix + list_in[0]);  break;
				default:  _ul2(ul, id + i, o.categories[i], prefix, list_in);
			}
			list = list_out;
		}
		if (list.length < 4) for (i = 0; i < list.length; ++i) _li(ul, list[i]);
		else _ul2(ul, id + i, id, '', list);
		filter_el.appendChild(ul);
	}
	if (!opt || !filter_el) return;
	while (filter_el.firstChild) filter_el.removeChild(filter_el.firstChild);
	var days = {}, areas = {}, tags = {},
	    lvl = (opt.area && opt.area.loc_level) || 0;
	for (var i = 0, l = this.list.length; i < l; ++i) {
		var p = this.list[i];
		if (p.date) days[p.date] = 1;
		if (opt.area && (typeof p.loc == 'object') && p.loc && p.loc[lvl]) areas[p.loc[lvl]] = (areas[p.loc[lvl]] || 0) + 1;
		if (opt.tag && (typeof p.tags == 'object') && p.tags) for (var j = 0; j < p.tags.length; ++j) {
			var t_s = opt.tag.set_category && opt.tag.set_category[p.tags[j]];
			if (t_s) p.tags[j] = t_s + ':' + p.tags[j];
			tags[p.tags[j]] = (tags[p.tags[j]] || 0) + 1;
		}
	}
	if (opt.day && opt.day.exclude) {
		var d_re = new RegExp(opt.day.exclude.join('|'));
		for (var d in days) if (d_re.test(d)) delete days[d];
	}
	this.days = {};
	for (var d in days) {
		var d_d = KonOpas.parse_date(d), d_n = {'N': d_d ? d_d.getDay() : -1 };
		this.days[d] = {
			'short': i18n.txt('weekday_short_n', d_n),
			'long': i18n.txt('weekday_n', d_n)
		};
	}
	if (opt.area) _fill('area', areas);
	if (opt.tag) _fill('tag', tags);
}


KonOpas.Prog.prototype.show_filter_sum = function(ls, f) {
	var fs = _el('filter_sum'); if (!fs) return;
	var cb = _el('q_clear');
	var _a = function(txt, unset) {
		var excl = {id:1}; if (unset) excl[unset] = 1;
		return '<a href="' + KonOpas.Prog.hash(f, excl) + '">' + txt + '</a>';
	}
	if (f.id_only) {
		fs.innerHTML = i18n.txt('filter_sum_id', { 'N':ls.length, 'TITLE':_a(ls[0].title), 'ID':_a(f.id) });
		if (cb) cb.disabled = false;
	} else {
		var d = { 'N': f.n_listed,
			'ALL': !f.show_all || f.tag_str || f.area_str || f.query_str ? '' : _a(i18n.txt('all'), {}, 0),
			'TAG': f.tag_str ? _a(f.tag_str, 'tag') : '' };
		if (f.day && !f.show_all) {
			d['DAY'] = i18n.txt('weekday_n', {'N': KonOpas.parse_date(f.day).getDay() });
			if (f.n_hidden) d['TIME'] = KonOpas.pretty_time(f.now, konopas);
		} else {
			if (f.n_hidden) d['LIVE'] = true;
		}
		if (f.area_str) d['AREA'] = _a(f.area_str, 'area');
		if (f.query_str) d['Q'] = _a(f.query_str, 'query');
		fs.innerHTML = i18n.txt('filter_sum', d);
		if (cb) cb.disabled = !f.area_str && !f.tag_str && !f.query_str;
	}
}

// hashchange -> read filters from url + store -> set filters in html + store -> list items
KonOpas.Prog.prototype.show = function() {
	function _show_filters(f) {
		var prev = _el('prog_filters').getElementsByClassName('selected');
		if (prev) for (var i = prev.length - 1; i >= 0; --i) {
			var cl = prev[i].classList;
			if (cl.contains('popup-link')) prev[i].textContent = prev[i].getAttribute('data-title') || i18n.txt('More') + '…';
			cl.remove('selected');
		}
		for (var k in f) {
			if (k == 'query') {
				var q = _el("q");
				if (q) {
					q.value = f.query;
					if (f.query) q.classList.add('selected');
				}
			} else {
				var id = f[k];
				if (!id) id = 'all_' + k + 's';
				else if (id.match(/^[^a-zA-Z]/)) id = k[0] + id;
				var el = _el(id);
				if (el) {
					el.classList.add('selected');
					if (el.parentNode.id.match(/\d+$/)) {
						var p = el.parentNode.parentNode.firstChild;
						p.classList.add('selected');
						p.textContent = el.textContent;
					}
				}
			}
		}
	}
	function _filter(it) {
		if (this.area) {
			if (this.area instanceof RegExp) {
				if (!this.area.test(it.loc.join(';'))) return false;
			} else {
				if (!it.loc || (it.loc.indexOf(this.area) < 0)) return false;
			}
		}
		if (this.tag) {
			if (this.tag instanceof RegExp) {
				if (!this.tag.test(it.title)) return false;
			} else {
				if (!it.tags || (it.tags.indexOf(this.tag) < 0)) return false;
			}
		}
		if (this.query) {
			var found = this.query.test(it.title)
				|| this.query.test(it.desc)
				|| (it.loc && this.query.test(it.loc.join('\t')))
				|| (it.tags && this.query.test(it.tags.join('\t')))
				|| (it.people && it.people.some(function(p){ return this.query.test(p.name); }, this));
			if (!found) return false;
		}
		return true;
	}
	function _show_list(f, self) {
		f.area_str = f.area || '';
		if (f.area && _el(f.area)) {
			var t = _el(f.area).getAttribute("data-regexp");
			if (t) f.area = new RegExp(t);
		}
		f.tag_str = f.tag || '';
		if (f.tag && _el(f.tag)) {
			var t = _el(f.tag).getAttribute("data-regexp");
			if (t) f.tag = new RegExp(t);
		}
		f.query_str = f.query || '';
		if (f.query) f.query = KonOpas.glob_to_re(f.query);
		f.id_only = !!f.id;
		if (f.id_only) for (var i in f) if ((i != 'id') && (i != 'id_only') && f[i]) {
			f.id_only = false;
			break;
		}
		var ls = self.list.filter(f.id_only ? function(it){ return it.id == f.id; } : _filter, f);
		if (f.id && ls.every(function(p) { return p.id != f.id; })) {
			f.id = '';
			if (KonOpas.Prog.set_filters(f)) return;
		}
		f.hide_ended = true;
		f.prog_view = true;
		KonOpas.Item.show_list(ls, f);
	}

	var f = KonOpas.Prog.get_filters();
	if (KonOpas.Prog.set_filters(f)) return;
	_show_filters(f);
	for (var k in f) {
		if (!k || !f[k] || (f[k] == 'all_' + k + 's')) { delete f[k]; continue; }
	}
	_show_list(f, this);
}
KonOpas.Server = function(id, stars, opt) {
	this.id = id;
	this.stars = stars;

	opt = opt || {};
	this.host = opt.host ||  'https://konopas-server.appspot.com';
	this.el_id = opt.el_id || 'server_connect';
	this.err_el_id = opt.err_el_id || 'server_error';
	try { this.store = localStorage; } catch (e) { this.store = new KonOpas.VarStore(); }

	this.connected = false;
	this.token = this.store.getItem('konopas.token') || false;
	this.ical = this.store.getItem('konopas.'+this.id+'.ical_link') || false;
	this.prog_data = {};
	this.prog_server_mtime = 0;
	this.el = document.getElementById(this.el_id);
	this.err_el = false;

	this.disconnect();
	if (this.stars) this.stars.server = this;
	if (this.el && this.id) this.exec('info');
	else _log("server init failed", 'warn');

	var m = /#server_error=(.+)/.exec(window.location.hash);
	if (m) this.error(decodeURIComponent(m[1].replace(/\+/g, ' ')), window.location.href);
}

KonOpas.Server.prototype.disconnect = function() {
	this.connected = false;
	if (this.el) this.el.innerHTML = '<div id="server_info">' + i18n.txt('Not connected') + '</div>';
	document.body.classList.remove('logged-in');
}

KonOpas.Server.prototype.logout = function(ev) {
	_log('server logout');
	this.exec('/logout');
	(ev || window.event).preventDefault();
}

KonOpas.Server.prototype.error = function(msg, url) {
	_log('server error ' + msg + ', url: ' + url, 'error');
	if (msg =='') {
		var cmd = url.replace(this.host, '').replace('/' + this.id + '/', '');
		msg = i18n.txt('server_cmd_fail', {'CMD':'<code>'+cmd+'</code>'});
	}
	if (!this.err_el) {
		var el = document.createElement('div');
		el.id = this.err_el_id;
		el.title = i18n.txt('Click to close');
		el.onclick = function(ev) { this.err_el.style.display = 'none'; }.bind(this);
		document.body.appendChild(el);
		this.err_el = el;
	}
	this.err_el.innerHTML = '<div>' + i18n.txt('Server error') + ': <b>' + msg + '</b></div>';
	this.err_el.style.display = 'block';
	return true;
}

KonOpas.Server.prototype.onmessage = function(ev) {
	ev = ev || window.event;
	if (ev.origin != this.host) {
		_log('Got an unexpected message from ' + ev.origin, 'error');
		_log(ev);
		return;
	}
	var self = this;
	JSON.parse(ev.data, function(k, v) {
		switch (k) {
			case 'ok':    self.cb_ok(v);      break;
			case 'fail':  self.error('', v);  break;
		}
	});
}



// ------------------------------------------------------------------------------------------------ prog

KonOpas.Server.prototype.prog_mtime = function() {
	var mtime = this.prog_server_mtime;
	for (var id in this.prog_data) {
		if (this.prog_data[id][1] > mtime) mtime = this.prog_data[id][1];
	}
	return mtime;
}

KonOpas.Server.prototype.add_prog = function(id, add_star) {
	if (id instanceof Array) id = id.join(',');
	_log('server add_prog "' + id + '" ' + (add_star ? '1' : '0'));
	var t = this.prog_mtime();
	this.exec('prog'
		+ (add_star ? '?add=' : '?rm=') + id
		+ (t ? '&t=' + t : ''));
}

KonOpas.Server.prototype.set_prog = function(star_list) {
	_log('server set_prog "' + star_list);
	var t = this.prog_mtime();
	this.exec('prog'
		+ '?set=' + star_list.join(',')
		+ (t ? '&t=' + t : ''));
}



// ------------------------------------------------------------------------------------------------ ical

KonOpas.Server.prototype.show_ical_link = function(p_el) {
	var html = '';
	if (!this.connected) {
		html = i18n.txt('ical_login');
	} else if (this.ical) {
		if (typeof this.ical == 'string') {
			html = i18n.txt('ical_link') + '<br><a href="' + this.ical + '">' + this.ical + '</a>'
				+ '<br><span class="hint">' + i18n.txt('ical_hint') + '</span>';
		} else {
			html = i18n.txt('ical_make', {'A_TAG':'<a id="ical_link" class="js-link">'});
		}
	}
	if (p_el) p_el.innerHTML += '<p id="ical_text">' + html;
	else {
		var i_el = document.getElementById('ical_text');
		if (i_el) i_el.innerHTML = html;
	}
	var a = document.getElementById('ical_link');
	if (a) {
		a.onclick = function() { this.exec('ical_link'); }.bind(this);
	}
}



// ------------------------------------------------------------------------------------------------ exec

KonOpas.Server.prototype.url = function(cmd) {
	if (this.token) cmd += (cmd.indexOf('?') != -1 ? '&' : '?') + 'k=' + encodeURIComponent(this.token);
	return this.host + (cmd[0] == '/' ? '' : '/' + this.id + '/') + cmd;
}

// based on https://github.com/IntoMethod/Lightweight-JSONP/blob/master/jsonp.js
KonOpas.Server.prototype.exec = function(cmd) {
	var script = document.createElement('script'),
		done = false,
		url = this.url(cmd);
	script.src = url;
	script.async = true;
	script.onerror = function(ev) { this.error('', (ev || window.event).target.src); }.bind(this);

	script.onload = script.onreadystatechange = function() {
		if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
			done = true;
			script.onload = script.onreadystatechange = null;
			if (script && script.parentNode) {
				script.parentNode.removeChild(script);
			}
		}
	};
	document.getElementsByTagName('head')[0].appendChild(script);
}



// ------------------------------------------------------------------------------------------------ cb ok/fail

// callback for successful logout, prog
KonOpas.Server.prototype.cb_ok = function(v) {
	var m = /^(?:https?:\/\/[^\/]+)?\/?([^?\/]*)(?:\/([^?]*))(?:\?(.*))?/.exec(v);
	var cmd = m[2] || '';
	var query = m[3] || '';
	switch (cmd) {
		case 'logout':
			this.disconnect();
			this.token = false;
			this.store.setItem('konopas.token', '');
			this.prog_data = {};
			this.prog_server_mtime = 0;
			if (this.stars) {
				this.stars.data = {};
				this.stars.write();
				konopas.set_view();
			}
			this.exec('info');
			_log("server ok (logout): " + JSON.stringify(v));
			break;

		case 'prog':
			var t = /&server_mtime=(\d+)/.exec(query);
			if (t) this.prog_server_mtime = parseInt(t[1], 10);
			_log("server ok (prog): " + JSON.stringify(v));
			break;

		default:
			_log("server ok (???): " + JSON.stringify(v), 'warn');
	}
}

// callback for reporting server errors
KonOpas.Server.prototype.cb_fail = function(v) {
	this.error(v.msg, v.url);
}



// ------------------------------------------------------------------------------------------------ callback

KonOpas.Server.prototype.cb_info = function(v) {
	_log("server info: " + JSON.stringify(v));
	this.connected = [v.name, v.email];
	this.el.innerHTML = '<div id="server_info">'
	                  + '<a id="server_logout" href="' + this.url(v.logout) + '">' + i18n.txt('Logout') + '</a> '
	                  + '<span id="server_user" title="' + ((v.name != v.email) ? v.email : '') + '">' + v.name.replace(/@.*/, '')
	                  + '</span></div>';
	if (v.ical) {
		this.ical = this.ical || true;
		this.show_ical_link(false);
	}
	document.getElementById('server_logout').onclick = this.logout.bind(this);
	document.body.classList.add('logged-in');
	if (typeof jsErrLog == 'object') jsErrLog.info = v.name.replace(/[ @].*/, '');
}

KonOpas.Server.prototype.cb_token = function(token) {
	_log("server token: " + token);
	this.token = token;
	this.store.setItem('konopas.token', token);
}

KonOpas.Server.prototype.cb_login = function(v) {
	_log("server login: " + JSON.stringify(v));
	var links = [];
	for (var cmd in v) {
		links.push('<a href="' + this.url(cmd) + '">' + v[cmd] + '</a>');
	}
	this.el.innerHTML = '<div id="login-links">'
		+ '\n&raquo; <span class="popup-link" id="login-popup-link">' + i18n.txt('Login to sync your data') + '</span>\n'
		+ '<div class="popup" id="login-popup">' + i18n.txt('login_why')
		+ "\n<ul>\n<li>" + links.join("\n<li>")
		+ "\n</ul></div></div>";
	_el('login-popup-link').onclick = KonOpas.popup_open;
}

KonOpas.Server.prototype.cb_my_prog = function(v) {
	_log("server my_prog: " + JSON.stringify(v));
	this.prog_data = v.prog;
	if (v.t0) for (var id in this.prog_data) { this.prog_data[id][1] += v.t0; }
	if (this.stars) this.stars.sync(this.prog_data);
	else _log("Server.stars required for prog sync", 'warn');
}

KonOpas.Server.prototype.cb_my_votes = function(v) { /* obsolete */ }
KonOpas.Server.prototype.cb_pub_data = function(p) { /* obsolete */ }
KonOpas.Server.prototype.cb_show_comments = function(id, c) { /* obsolete */ }

KonOpas.Server.prototype.cb_ical_link = function(url) {
	this.ical = url;
	this.store.setItem('konopas.'+this.id+'.ical_link', url);
	this.show_ical_link(false);
}
KonOpas.Stars = function(id, opt) {
	opt = opt || {};
	this.name = 'konopas.' + id + '.stars';
	try { this.store = localStorage || sessionStorage || (new KonOpas.VarStore()); }
	catch (e) { this.store = new KonOpas.VarStore(); }
	this.tag = opt.tag || 'has_star';
	this.server = false;
	this.data = this.read();
}

KonOpas.Stars.prototype.read = function() {
	return JSON.parse(this.store && this.store.getItem(this.name) || '{}');
}

KonOpas.Stars.prototype.write = function() {
	try {
		if (this.store) this.store.setItem(this.name, JSON.stringify(this.data));
	} catch (e) {
		if ((e.code != DOMException.QUOTA_EXCEEDED_ERR) || (this.store.length != 0)) { throw e; }
	}
}

KonOpas.Stars.prototype.list = function() {
	var list = [];
	if (this.data) for (var id in this.data) {
		if ((this.data[id].length == 2) && this.data[id][0]) list.push(id);
	}
	return list;
}

KonOpas.Stars.prototype.add = function(star_list, mtime) {
	mtime = mtime || Math.floor(Date.now()/1000);
	star_list.forEach(function(id) { this.data[id] = [1, mtime]; }, this);

	this.write();
	if (this.server) this.server.set_prog(this.list());
}

KonOpas.Stars.prototype.set = function(star_list) {
	var mtime = Math.floor(Date.now()/1000);
	if (this.data) for (var id in this.data) {
		this.data[id] = [0, mtime];
	}
	this.add(star_list, mtime);
}

KonOpas.Stars.prototype.toggle = function(el, id) {
	var add_star = !el.classList.contains(this.tag);
	var mtime = Math.floor(Date.now()/1000);

	this.data[id] = [add_star ? 1 : 0, mtime];
	this.write();
	if (this.server) this.server.add_prog(id, add_star);

	if (add_star) el.classList.add(this.tag);
	else          el.classList.remove(this.tag);
}

KonOpas.Stars.prototype.sync = function(new_data) {
	var local_mod = [], redraw = false;
	for (var id in new_data) {
		if (new_data[id].length != 2) {
			_log('Stars.sync: invalid input ' + id + ': ' + JSON.stringify(new_data[id]), 'warn');
			continue;
		}
		if (!(id in this.data) || (new_data[id][1] > this.data[id][1])) {
			local_mod.push(id);
			if (!(id in this.data) || (new_data[id][0] != this.data[id][0])) redraw = true;
			this.data[id] = new_data[id];
		}
	}
	if (local_mod.length) {
		_log('Stars.sync: local changes: ' + local_mod + (redraw ? ' -> redraw' : ''));
		this.write();
		if (redraw) konopas.set_view();
	}

	if (this.server) {
		var server_add = [], server_rm = [];
		for (var id in this.data) {
			if (!(id in new_data) || (new_data[id][1] < this.data[id][1])) {
				if (this.data[id][0]) server_add.push(id);
				else                  server_rm.push(id);
			}
		}
		if (server_add.length) {
			_log('Stars.sync: server add: ' + server_add);
			this.server.add_prog(server_add, true);
		}
		if (server_rm.length) {
			_log('Stars.sync: server rm: ' + server_rm);
			this.server.add_prog(server_rm, false);
		}

		if (!local_mod.length && !server_add.length && !server_rm.length) {
			_log('Stars.sync: no changes');
		}
	}
}

KonOpas.Stars.prototype.show = function() {
	var view = _el("star_data"),
		hash = window.location.hash.substr(6),
	    set_raw = (hash && (hash.substr(0,4) == 'set:')) ? hash.substr(4).split(',') : [],
	    set = konopas.program.list.filter(function(p) { return (set_raw.indexOf(p.id) >= 0); }).map(function(p) { return p.id; }),
	    set_len = set.length,
	    html = '',
	    star_list = this.list(),
	    stars_len = star_list.length;
	if (konopas.store.limit && (!this.server || !this.server.connected)) {
		html = '<p>' + i18n.txt('star_no_memory', {'WHY': konopas.store.limit, 'SERVER': !!this.server});
	}
	if (!stars_len && !set_len) {
		_el("prog_ls").innerHTML = '';
		view.innerHTML = html + '<p>' + i18n.txt('star_hint');
		return;
	}
	document.body.classList.remove("show_set");
	set.sort();
	star_list.sort();
	var set_link = '#star/set:' + star_list.join(',');
	if (set_len) {
		if (KonOpas.arrays_equal(set, star_list)) {
			html += '<p>' + i18n.txt('star_export_this', { 'THIS':set_link }) + '<p>' +
				i18n.txt('star_export_share', {
					'SHORT': KonOpas.link_to_short_url(location.href),
					'QR': KonOpas.link_to_qr_code(location.href)
				});
		} else {
			document.body.classList.add("show_set");
			var n_same = KonOpas.array_overlap(set, star_list);
			var n_new = set_len - n_same;
			var n_bad = set_raw.length - set_len;
			html += '<p>' + i18n.txt('star_import_this', {'THIS':location.href})
				+ '<p>' + i18n.txt('star_import_diff', { 'PREV':stars_len, 'NEW':n_new, 'SAME':n_same });
			if (n_bad) html += ' ' + i18n.txt('star_import_bad', {'BAD':n_bad});
			if (!stars_len || (n_same != stars_len)) {
				html += '<p>&raquo; <a href="#star" id="star_set_set">' + i18n.txt('star_set') + '</a>';
			}
			if (stars_len) {
				if (n_same != stars_len) {
					var d = [];
					if (n_new) d.push(i18n.txt('add_n', {'N':n_new}));
					d.push(i18n.txt('discard_n', {'N':stars_len - n_same}));
					html += ' (' + d.join(', ') + ')';
				}
				if (n_new) html += '<p>&raquo; <a href="#star" id="star_set_add">' + i18n.txt('star_add', {'N':n_new}) + '</a>';
			}
		}
	} else {
		html += '<p id="star_links">&raquo; ' + i18n.txt('star_export_link', { 'URL':set_link, 'N':stars_len });
	}
	view.innerHTML = html;
	var el_set = _el('star_set_set'); if (el_set) el_set.onclick = function() { konopas.stars.set(set); return true; };
	var el_add = _el('star_set_add'); if (el_add) el_add.onclick = function() { konopas.stars.add(set); return true; };
	if (this.server) this.server.show_ical_link(view);
	var ls = konopas.program.list.filter(function(it) { return (star_list.indexOf(it.id) >= 0) || (set.indexOf(it.id) >= 0); });
	KonOpas.Item.show_list(ls, {hide_ended:true});
	if (set_len) for (var i = 0; i < set_len; ++i) {
		var el = _el('s' + set[i]);
		if (el) el.classList.add("in_set");
	}
}
if (typeof i18n == 'undefined') i18n = {};
i18n.txt = function(key){ return key; };
i18n.translate_html = function(map, a) {
	var list = document.querySelectorAll('['+a+']');
	for (var i = 0, node; node = list[i]; ++i) {
		var key = node.getAttribute(a) || node.textContent.trim();
		if (key in map) {
			var data = node.getAttribute(a + '-var');
			var attr = node.getAttribute(a + '-attr');
			var str = map[key](data && JSON.parse('{' + data.replace(/[^,:]+/g, '"$&"') + '}'));
			if (attr) node.setAttribute(attr, str);
			else node.innerHTML = str;
		}
	}
}

function _log(msg, lvl) {
	if (window.console) switch (lvl) {
		case 'error': console.error(msg); break;
		case 'warn':  console.warn(msg); break;
		default:      console.log(msg);
	}
}

function _el(id) { return id && document.getElementById(id); }

function _new_elem(tag, cl, text, hide) {
	var e = document.createElement(tag);
	if (cl) e.className = cl;
	if (text) e.textContent = text;
	if (hide) e.style.display = 'none';
	return e;
}

KonOpas.link_to_short_url = function(url) {
	var u = encodeURIComponent(url.replace(/^http:\/\//, ''));
	return 'http://is.gd/create.php?url=' + u;
}
KonOpas.link_to_qr_code = function(url) {
	var u = encodeURIComponent(url.replace(/^http:\/\//, ''));
	return 'http://chart.apis.google.com/chart?cht=qr&chs=350x350&chl=' + u;
}

KonOpas.hash_encode = function(s) { return encodeURIComponent(s).replace(/%20/g, '+'); }
KonOpas.hash_decode = function(s) { return decodeURIComponent(s.replace(/\+/g, '%20')); }

KonOpas.glob_to_re = function(pat) {
	var re_re = new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\/-]', 'g');
	pat = pat.replace(re_re, '\\$&').replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
	var terms = pat.match(/"[^"]*"|'[^']*'|\S+/g).map(function(el){
		return '\\b' + el.replace(/^(['"])(.*)\1$/, '$2\\b');
	});
	return new RegExp(terms.join('|'), 'i');
}


// ------------------------------------------------------------------------------------------------ storage

KonOpas.Store = function(id) {
	try {
		sessionStorage.setItem('konopas.test_var', '1');
		sessionStorage.removeItem('konopas.test_var', '1');
		this.get = function(k) {
			var v = sessionStorage.getItem('konopas.' + id + '.' + k);
			return v ? JSON.parse(v) : v;
		}
		this.set = function(k, v) {
			sessionStorage.setItem('konopas.' + id + '.' + k, JSON.stringify(v));
		}
		this.limit = '';
	} catch (e) {
		var data = {};
		this.get = function(k) { return data[k]; };
		this.set = function(k, v) { data[k] = v; };
		this.limit = (e.name == 'SecurityError') ? 'FFcookies'
				   : ((e.code === DOMException.QUOTA_EXCEEDED_ERR) && (sessionStorage.length === 0)) ? 'IOSprivate'
				   : '?';
	}
}

KonOpas.VarStore = function() {
	var data = {};
	this.getItem = function(k) { return data[k]; };
	this.setItem = function(k, v) { data[k] = v; };
}


// ------------------------------------------------------------------------------------------------ string generation

KonOpas.clean_name = function(p, span_parts) {
	var fn = '', ln = '';
	switch (p.name.length) {
		case 1:
			ln = p.name[0];
			break;
		case 2:
			if (p.name[1]) {
				fn = p.name[0];
				ln = p.name[1];
			} else {
				ln = p.name[0];
			}
			break;
		case 3:
			fn = p.name[2] + ' ' + p.name[0];
			ln = p.name[1];
			break;
		case 4:
			fn = p.name[2] + ' ' + p.name[0];
			ln = p.name[1] + (p.name[3] ? ', ' + p.name[3] : '');
			break;
	}
	return span_parts
		? '<span class="fn">' + fn.trim() + '</span> <span class="ln">' + ln.trim() + '</span>'
		: (fn + ' ' + ln).trim();
}

KonOpas.clean_links = function(p) {
	var ok = false, o = {};
	if (p && ('links' in p)) {
		if (p.links.img || p.links.photo) {
			var img = (p.links.img || p.links.photo).trim();
			if (/^www/.test(img)) img = 'http://' + img;
			if (/:\/\//.test(img)) { o['img'] = { 'tgt': img }; ok = true; }
		}
		if (p.links.url) {
			var url = p.links.url.trim();
			if (!/:\/\//.test(url)) url = 'http://' + url;
			o['URL'] = { 'tgt': url, 'txt': url.replace(/^https?:\/\//, '') };
			ok = true;
		}
		if (p.links.fb) {
			var fb = p.links.fb.trim().replace(/^(https?:\/\/)?(www\.)?facebook.com(\/#!)?\//, '');
			o['Facebook'] = { 'txt': fb };
			if (/[^a-zA-Z0-9.]/.test(fb) && !/^pages\//.test(fb)) fb = 'search.php?q=' + encodeURI(fb).replace(/%20/g, '+');
			o['Facebook']['tgt'] = 'https://www.facebook.com/' + fb;
			ok = true;
		}
		if (p.links.twitter) {
			var tw = p.links.twitter.trim().replace(/[@＠﹫]/g, '').replace(/^(https?:\/\/)?(www\.)?twitter.com(\/#!)?\//, '');
			o['Twitter'] = { 'txt': '@' + tw };
			if (/[^a-zA-Z0-9_]/.test(tw)) tw = 'search/users?q=' + encodeURI(tw).replace(/%20/g, '+');
			o['Twitter']['tgt'] = 'https://www.twitter.com/' + tw;
			ok = true;
		}
	}
	return ok ? o : false;
}


// ------------------------------------------------------------------------------------------------ array comparison

KonOpas.arrays_equal = function(a, b) {
	if (!a || !b) return false;
	if (a.length != b.length) return false;
	for (var i = 0; i < a.length; ++i) {
		if (a[i] != b[i]) return false;
	}
	return true;
}

KonOpas.array_overlap = function(a, b) {
	if (!a || !b) return 0;
	if (a.length > b.length) return KonOpas.array_overlap(b, a);
	var n = 0, i, j;
	for (i = 0; i < a.length; ++i) {
		for (j = 0; j < b.length; ++j) if (a[i] == b[j]) { ++n; break; }
	}
	return n;
}


// ------------------------------------------------------------------------------------------------ DOM manipulation

KonOpas.popup_open = function(ev) {
	ev = ev || window.event;
	if (ev.which != 1) return;
	var src_el = ev.target, pop_el = src_el.nextElementSibling;
	if (!pop_el || !pop_el.classList.contains('popup')) {
		if (src_el.href && /\.(gif|jpe?g|png)$/i.test(src_el.href)) {
			pop_el = _new_elem('img', 'popup');
			pop_el.src = src_el.href;
			src_el.parentNode.insertBefore(pop_el, src_el.nextSibling);
		} else return;
	}
	var wrap_el = _new_elem('div', 'popup-wrap');
	wrap_el.onclick = function() {
		pop_el.parentNode.removeChild(pop_el);
		wrap_el.parentNode.removeChild(wrap_el);
		src_el.parentNode.insertBefore(pop_el, src_el.nextSibling);
	};
	var pop_title = pop_el.getAttribute('data-title') || '';
	if (pop_title) wrap_el.appendChild(_new_elem('div', 'popup-title', pop_title));
	pop_el.parentNode.removeChild(pop_el);
	wrap_el.appendChild(pop_el);
	document.body.appendChild(wrap_el);
	if (src_el.href) ev.preventDefault();
}

KonOpas.toggle_collapse = function(ev) {
	ev = ev || window.event;
	var title = ev.target, body = title && title.nextElementSibling;
	if (!body) return;
	if (window.getComputedStyle(body).getPropertyValue('display') == 'none') {
		title.classList.remove('collapse');
		title.classList.add('collapse-open');
	} else {
		title.classList.add('collapse');
		title.classList.remove('collapse-open');
	}
}


// ------------------------------------------------------------------------------------------------ time & date

KonOpas.pretty_time = function(t, opt) {
	function pre0(n) { return (n < 10 ? '0' : '') + n; }
	function _pretty_time(h, m) {
		if (opt.time_show_am_pm) {
			var h12 = h % 12; if (h12 == 0) h12 = 12;
			var m_str = ((m == 0) && opt.abbrev_00_minutes ) ? '' : ':' + pre0(m);
			return h12 + m_str + (h < 12 ? 'am' : 'pm');
		} else {
			return pre0(h) + ':' + pre0(m);
		}
	}
	opt = opt || {};
	if (t instanceof Date) {
		return _pretty_time(t.getHours(), t.getMinutes());
	} else if (typeof t == 'string' || t instanceof String) {
		if (opt.time_show_am_pm) {
			var a = t.split(':'); // hh:mm
			return _pretty_time(parseInt(a[0], 10), parseInt(a[1], 10));
		} else return t;
	} else return '';
}

KonOpas.pretty_time_diff = function(t) {
	var d = (Date.now() - t) / 1e3,
	    a = Math.abs(d),
	    s = [1, 60, 60, 24, 7, 4.333, 12, 1e9];
	if (a < 20) return i18n.txt('just now');
	for (var i = 0, l = s.length; i < l; ++i) {
		if ((a /= s[i]) < 2) return i18n.txt('time_diff', { 'T':~~(a *= s[i]), 'T_UNIT':i-1, 'T_PAST':d>0 });
	}
}

KonOpas.parse_date = function(day_str) {
	if (!day_str) return false;
	var a = day_str.match(/(\d+)/g); if (!a || (a.length < 3)) return false;
	var y = parseInt(a[0], 10), m = parseInt(a[1], 10), d = parseInt(a[2], 10);
	if (!y || !m || !d) return false;
	return new Date(y, m - 1, d, 12);
}

KonOpas.data_date = function(d) {
	function pre0(n) { return (n < 10 ? '0' : '') + n; }
	var t = (d instanceof Date) ? d : KonOpas.parse_date(d);
	return t.getFullYear() + '-' + pre0(t.getMonth() + 1) + '-' + pre0(t.getDate());
}

KonOpas.pretty_date = function(d, opt) {
	opt = opt || {};
	var o = { weekday: "long", month: "long", day: "numeric" },
	    t = (d instanceof Date) ? d : KonOpas.parse_date(d);
	if (!t) return d;
	if (Math.abs(t - Date.now()) > 1000*3600*24*60) o.year = "numeric";
	var s = t.toLocaleDateString(opt.lc, o);
	return s.charAt(0).toUpperCase() + s.slice(1);
}

KonOpas.time_sum = function(t0_str, m_str) {
	var t = 60 * t0_str.substr(0,2) + 1 * t0_str.substr(3,2) + 1 * m_str,
	    h = (t / 60) >> 0,
	    m = t - 60 * h;
	return '' + (h % 24) + ':' + (m<10?'0':'') + m;
}
