
function updateCondensersHTML(){
	tmp.el.condenser.setTxt(showNum(player.normal_condensers)+(getCadaverEff2().gt(0)?" + "+showNum(getCadaverEff2()):""));
	tmp.el.condenserUp.setClasses({ btn: true, locked: !tmp.condensed.normal_condensers.can });
    tmp.el.condenserEff.setHTML("x"+showNum(tmp.condensed.normal_condensers.effect)+
    (tmp.condensed.normal_condensers.effect.gte(tmp.condensed.normal_condensers.effectSS)
    ? " <span class='sc'>(softcapped)</span>"
    : ""));
	tmp.el.condenserReq.setTxt(formatDistance(tmp.condensed.normal_condensers.req));
	tmp.el.condenserName.setTxt("Condenser");

	tmp.el.rCondenserDiv.setClasses({ btn: true, locked: !tmp.condensed.rc.can, rckt: tmp.condensed.rc.can });
    tmp.el.rCondenserEff.setHTML("x"+showNum(tmp.condensed.rc.effect)+
    (tmp.condensed.rc.effect.gte(tmp.condensed.rc.effectSS)
    ? " <span class='sc'>(softcapped)</span>"
    : ""))
	tmp.el.rCondenserCost.setTxt(showNum(tmp.condensed.rc.cost));

    tmp.el.trCondenser.setClasses({ btn: true, locked: !tmp.condensed.tr.can, rt: tmp.condensed.tr.can });
	tmp.el.trCondenserCost.setTxt(showNum(tmp.condensed.tr.cost));

    tmp.el.cadaverCondensed.setHTML(`, give <span class="dead">${showNum(getCadaverEff2())}</span> free normal & rocket condensers.`)

    tmp.el.pthCondenser.setClasses({ btn: true, locked: !tmp.condensed.pth.can, gross: tmp.condensed.pth.can });
	tmp.el.pthCondenserCost.setTxt(showNum(tmp.condensed.pth.cost));
    tmp.el.pthCondenserEff.setHTML("x"+showNum(tmp.condensed.pth.effect)+
    (tmp.condensed.pth.effect.gte(tmp.condensed.pth.effectSS)
    ? " <span class='sc'>(softcapped)</span>"
    : ""))
}

function updateTempCondensed() {
    if (!tmp.condensed) tmp.condensed = {}

    if (!tmp.condensed.normal_condensers) tmp.condensed.normal_condensers = {}
    tmp.condensed.normal_condensers.req = E(100).pow(player.normal_condensers.pow(1.5).mul(player.achievements.includes(45)?0.75:1)).mul(100)
    .div(player.tr.upgrades.includes(38) ? TR_UPGS[38].current() : 1)
    tmp.condensed.normal_condensers.can = player.distance.gte(tmp.condensed.normal_condensers.req)
    tmp.condensed.normal_condensers.layer = new Layer("normal_condensers", tmp.condensed.normal_condensers.can, "semi-forced");

    tmp.condensed.normal_condensers.effect = player.distance.add(1).log10().add(1).pow(player.normal_condensers.add(getCadaverEff2()))
    if (player.tr.upgrades.includes(37)) tmp.condensed.normal_condensers.effect = tmp.condensed.normal_condensers.effect.pow(1.25)
    tmp.condensed.normal_condensers.effectSS = E(1e3)
    if (tmp.condensed.normal_condensers.effect.gte(tmp.condensed.normal_condensers.effectSS)) tmp.condensed.normal_condensers.effect = tmp.condensed.normal_condensers.effect.div(tmp.condensed.normal_condensers.effectSS)
    .root(player.achievements.includes(16)?3:4).mul(tmp.condensed.normal_condensers.effectSS)

    if (!tmp.condensed.rc) tmp.condensed.rc = {}
    tmp.condensed.rc.cost = E(100).pow(player.condensers.rockets.pow(1.25)).mul(100).div(player.tr.upgrades.includes(38) ? TR_UPGS[38].current() : 1).floor()
    tmp.condensed.rc.can = player.rockets.gte(tmp.condensed.rc.cost)
    if (!tmp.condensed.rc.buy) tmp.condensed.rc.buy = function() {
        if (tmp.condensed.rc.can) {
            player.rockets = player.rockets.sub(tmp.condensed.rc.cost)
            player.condensers.rockets = player.condensers.rockets.add(1)
        }
    }
    tmp.condensed.rc.effect = player.rockets.add(1).log10().add(1).pow(player.condensers.rockets.add(getCadaverEff2()))
    if (player.tr.upgrades.includes(37)) tmp.condensed.rc.effect = tmp.condensed.rc.effect.pow(1.25)
    tmp.condensed.rc.effectSS = E(1e3)
    if (tmp.condensed.rc.effect.gte(tmp.condensed.rc.effectSS)) tmp.condensed.rc.effect = tmp.condensed.rc.effect.div(tmp.condensed.rc.effectSS)
    .root(3).mul(tmp.condensed.rc.effectSS)

    if (!tmp.condensed.tr) tmp.condensed.tr = {}
    tmp.condensed.tr.cost = E(100).pow(player.condensers.tr.pow(1.25)).mul(1e3).floor()
    tmp.condensed.tr.can = player.tr.cubes.gte(tmp.condensed.tr.cost)
    if (!tmp.condensed.tr.buy) tmp.condensed.tr.buy = function() {
        if (tmp.condensed.tr.can) {
            player.tr.cubes = player.tr.cubes.sub(tmp.condensed.tr.cost)
            player.condensers.tr = player.condensers.tr.add(1)
        }
    }

    if (!tmp.condensed.pth) tmp.condensed.pth = {}
    tmp.condensed.pth.cost = E(100).pow(player.condensers.pathogens.pow(1.25)).mul(1e3).floor()
    tmp.condensed.pth.can = player.pathogens.amount.gte(tmp.condensed.pth.cost)
    if (!tmp.condensed.pth.buy) tmp.condensed.pth.buy = function() {
        if (tmp.condensed.pth.can) {
            player.pathogens.amount = player.pathogens.amount.sub(tmp.condensed.pth.cost)
            player.condensers.pathogens = player.condensers.pathogens.add(1)
        }
    }
    tmp.condensed.pth.effect = player.pathogens.amount.add(1).log10().add(1).pow(player.condensers.pathogens)
    tmp.condensed.pth.effectSS = E(1e3)
    if (tmp.condensed.pth.effect.gte(tmp.condensed.pth.effectSS)) tmp.condensed.pth.effect = tmp.condensed.pth.effect.div(tmp.condensed.pth.effectSS)
    .root(3).mul(tmp.condensed.pth.effectSS)
}

function getCadaverEff2() {
	if (!modeActive("condensed")) return E(0)
    let eff = player.collapse.cadavers.add(1).log10().mul(player.rank.add(player.tier.mul(5))).add(1).root(8).sub(1)
    return eff
}

function AutoCondensers() {
    if (!modeActive("condensed")) return
    if (player.automators.normal_condensers) {
        let bulk = E(0)
        if (player.distance.gte(100)) {
            bulk = player.distance
            .mul(player.tr.upgrades.includes(38) ? TR_UPGS[38].current() : 1)
            .div(100).max(1).logBase(100).div(player.achievements.includes(45)?0.75:1).root(1.5).add(1).floor()
        }
        if (bulk.gte(player.normal_condensers) && tmp.condensed.normal_condensers.can) {
            player.normal_condensers = bulk
            tmp.condensed.normal_condensers.layer.reset(false, true)
        }
    }
    if (player.automators.rocket_condensers) {
        let bulk = player.rockets.gte(100) ? player.rockets
        .mul(player.tr.upgrades.includes(38) ? TR_UPGS[38].current() : 1).div(100).max(1).logBase(100).root(1.25).add(1).floor() : E(0)
        if (bulk.gte(player.condensers.rockets) && tmp.condensed.rc.can) {
            player.condensers.rockets = bulk
        }
    }
}