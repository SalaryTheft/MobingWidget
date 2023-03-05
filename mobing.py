import requests
import json
from datetime import datetime

requests.packages.urllib3.disable_warnings()
requests.packages.urllib3.util.ssl_.DEFAULT_CIPHERS += ':HIGH:!DH:!aNULL'


def get_phpsessid() -> str:
    response = requests.get("https://int.mobing.co.kr/app/main.php")
    return response.cookies["PHPSESSID"]


def send_sms_verify(phpsessid: str, phone_number: str) -> bool:
    header = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"service_number": phone_number, "lang": "ko"}
    response = requests.post(
        "https://int.mobing.co.kr/app/certify.php",
        headers=header, data=data, cookies={"PHPSESSID": phpsessid}
    )
    if response.json()["res_cd"] != "200":
        raise Exception(f"인증번호 전송 실패: {response.json()['res_msg']}")
    return response.json()["res_cd"] == "200"


def check_sms_verify(phpsessid: str, verify_code: str) -> str:
    header = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"cert_key": verify_code, "lang": "ko"}
    response = requests.post(
        "https://int.mobing.co.kr/app/certify_confirm.php",
        headers=header, data=data, cookies={"PHPSESSID": phpsessid})
    if response.json()["res_cd"] != "200":
        raise Exception(f"인증번호 확인 실패: {response.json()['res_msg']}")
    return response.json()["res_key"]


def get_token(phpsessid: str, phone_number: str, key: str) -> str:
    header = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"service_number": phone_number, "service_key": key, "lang": "ko"}
    response = requests.post(
        "https://int.mobing.co.kr/app/preloading.php",
        headers=header, data=data, cookies={"PHPSESSID": phpsessid}
    )
    if response.json()["res_cd"] != "200":
        raise Exception(f"토큰 가져오기 실패: {response.json()['res_msg']}")
    return response.json()["res_tk"]


def get_service_account(phpsessid: str, key: str) -> str:
    params = {"tk": key, "lang": "ko"}
    response = requests.get(
        "https://int.mobing.co.kr/wapp/main.php",
        params=params, cookies={"PHPSESSID": phpsessid}
    )
    for line in response.text.splitlines():
        if "serviceAccount" in line:
            return line.split('"')[1]


def get_usuage_info(account: str) -> dict:
    response = requests.post(
        "https://ucselfcare.mobing.co.kr:8444/api/selfcare.do",
        data={
            "eventId": "5110", "serviceAccount": account,
            "callYyyymm": datetime.today().strftime("%Y%m")
        }
    )
    return response.json()


if __name__ == "__main__":
    print("모빙 서비스 번호 조회 및 사용량 조회 프로그램")
    print("="*50)

    php_sessid = get_phpsessid()
    phone_number = input("휴대폰 번호를 입력하세요: ")
    send_sms_verify(php_sessid, phone_number)
    verify_code = input("인증번호를 입력하세요: ")
    key = check_sms_verify(php_sessid, verify_code)
    token = get_token(php_sessid, phone_number, key)
    service_account = get_service_account(php_sessid, token)
    print(f"\nserviceAccount: {service_account}")
    usuage_info = get_usuage_info(service_account)
    print("사용량 정보(JSON):")
    print(json.dumps(usuage_info, indent=4, ensure_ascii=False))

    input("\n엔터를 누르면 종료됩니다.")
    exit(0)
