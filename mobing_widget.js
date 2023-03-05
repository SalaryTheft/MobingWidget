/**
 * 모빙 사용량 조회 위젯 for Scriptable (https://scriptable.app)
 */

let usuageInfo = await getUsuageData();
let widget = await createWidget();
widget.url = "https://m.mobing.co.kr/";
if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentSmall();
}
Script.complete();

async function createWidget(api) {
    let widget = new ListWidget();

    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [
        new Color("141414"),
        new Color("13233F")
    ];
    widget.backgroundGradient = gradient;

    if (args.widgetParameter === null) {
        let row = widget.addStack();
        let row_text = row.addText("파라미터를 입력 후 위젯을 추가해주세요.");
        row_text.textColor = Color.white();
        row_text.font = Font.boldMonospacedSystemFont(15);
        return widget;
    } else if (usuageInfo[0]?.resultMsg !== "SUCCESS") {
        let row = widget.addStack();
        let row_text = row.addText("데이터를 불러오는데 실패했습니다.");
        row_text.textColor = Color.white();
        row_text.font = Font.boldMonospacedSystemFont(15);
        return widget;
    }

    let infiniteSymbol = "∞"; // TODO: 무제한 요금제 처리

    // 데이터
    let dataUnit = usuageInfo[1].dataTotal > 1024 ? "GB" : "MB";
    let dataTotal = dataUnit === "GB" ? usuageInfo[1].dataTotal / 1024 : usuageInfo[1].dataTotal;
    let dataUsed = dataUnit === "GB" ? usuageInfo[1].totalDataUse / 1024 : usuageInfo[1].totalDataUse;

    let dataRow = widget.addStack();
    let dataTitleText = dataRow.addText("데이터");
    dataTitleText.textColor = new Color("57B7EF")
    dataTitleText.font = Font.boldMonospacedSystemFont(12);
    dataRow.addSpacer();

    let dataRemainText = dataRow.addText((dataTotal - dataUsed).toFixed(2) + dataUnit);
    dataRemainText.textColor = Color.white();
    dataRemainText.font = Font.boldMonospacedSystemFont(12);
    widget.addSpacer(2);

    let dataDetailRow = widget.addStack();
    let dataPercentageText = dataDetailRow.addText((dataUsed / dataTotal * 100).toFixed(2) + "% 사용");
    dataPercentageText.textColor = Color.white();
    dataPercentageText.textOpacity = 0.7;
    dataPercentageText.font = Font.boldMonospacedSystemFont(9);
    dataDetailRow.addSpacer();

    let dataTotalText = dataDetailRow.addText(dataTotal.toFixed(2) + dataUnit);
    dataTotalText.textColor = Color.white();
    dataTotalText.textOpacity = 0.7;
    dataTotalText.font = Font.boldMonospacedSystemFont(9);
    widget.addSpacer(6);

    // 통화
    let callUnit = "분";

    let callRow = widget.addStack();
    let callTitleText = callRow.addText("통화");
    callTitleText.textColor = new Color("77D772");
    callTitleText.font = Font.boldMonospacedSystemFont(12);
    callRow.addSpacer();

    let callRemainText = callRow.addText((usuageInfo[1].voiceTotal - usuageInfo[1].totalVoiceUse) + callUnit);
    callRemainText.textColor = Color.white();
    callRemainText.font = Font.boldMonospacedSystemFont(12);
    widget.addSpacer(2);

    let callDetailRow = widget.addStack();
    let callPercentageText = callDetailRow.addText((usuageInfo[1].totalVoiceUse / usuageInfo[1].voiceTotal * 100).toFixed(2) + "% 사용");
    callPercentageText.textColor = Color.white();
    callPercentageText.textOpacity = 0.7;
    callPercentageText.font = Font.boldMonospacedSystemFont(9);
    callDetailRow.addSpacer();

    let callTotalText = callDetailRow.addText(usuageInfo[1].voiceTotal + callUnit);
    callTotalText.textColor = Color.white();
    callTotalText.textOpacity = 0.7;
    callTotalText.font = Font.boldMonospacedSystemFont(9);
    widget.addSpacer(6);

    // 문자
    let textUnit = "건";

    let textRow = widget.addStack();
    let textTitleText = textRow.addText("문자");
    textTitleText.textColor = new Color("F4C140");
    textTitleText.font = Font.boldMonospacedSystemFont(12);
    textRow.addSpacer();

    let textRemainText = textRow.addText((usuageInfo[1].smsTotal - usuageInfo[1].totalSmsUse) + textUnit);
    textRemainText.textColor = Color.white();
    textRemainText.font = Font.boldMonospacedSystemFont(12);
    widget.addSpacer(2);

    let textDetailRow = widget.addStack();
    let textPercentageText = textDetailRow.addText((usuageInfo[1].totalSmsUse / usuageInfo[1].smsTotal * 100).toFixed(2) + "% 사용");
    textPercentageText.textColor = Color.white();
    textPercentageText.textOpacity = 0.7;
    textPercentageText.font = Font.boldMonospacedSystemFont(9);
    textDetailRow.addSpacer();

    let textTotalText = textDetailRow.addText(usuageInfo[1].smsTotal + textUnit);
    textTotalText.textColor = Color.white();
    textTotalText.textOpacity = 0.7;
    textTotalText.font = Font.boldMonospacedSystemFont(9);
    widget.addSpacer(6);

    // 부가통화 + 갱신시간
    let addCallRow = widget.addStack();
    let addCallTitleText = addCallRow.addText(
        "잔여 부가통화 " + (usuageInfo[1].addVoiceTotal - usuageInfo[1].addVoice) + callUnit
    );
    addCallTitleText.textColor = Color.white();
    addCallTitleText.textOpacity = 0.7;
    addCallTitleText.font = Font.boldMonospacedSystemFont(9);
    widget.addSpacer();
    
    let timestampRow = widget.addStack();
    let timestampText = timestampRow.addText("" + new Date().toLocaleString());
    timestampText.textColor = Color.white();
    timestampText.textOpacity = 0.7;
    timestampText.font = Font.boldMonospacedSystemFont(9);

    return widget;
}

async function getUsuageData() {
    return await fetchAPI();
}

async function fetchAPI() {
    let serviceAccount = args.widgetParameter;

    let url = "https://ucselfcare.mobing.co.kr:8444/api/selfcare.do";
    let req = new Request(url);
    req.method = "POST";
    req.headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    req.body =
        "eventId=" + encodeURIComponent("5110") +
        "&serviceAccount=" + encodeURIComponent(serviceAccount) +
        "&callYyyymm=" + encodeURIComponent(new Date().toISOString().slice(0, 7).replace(/-/g, ""));
    return await req.loadJSON();
}