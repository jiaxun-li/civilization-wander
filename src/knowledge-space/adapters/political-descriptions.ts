import type { SourceIds } from '../../../v6/schema/index.ts';

export interface PoliticalClaim { readonly text: string; readonly sourceIds: SourceIds }
export interface PoliticalRangeDescription { readonly scope: PoliticalClaim; readonly change: PoliticalClaim }
export interface PoliticalDescription {
  readonly centres: PoliticalClaim;
  readonly core: PoliticalClaim;
  readonly governance: PoliticalClaim;
  readonly phases: Readonly<Record<string, PoliticalRangeDescription>>;
  readonly events?: readonly (PoliticalRangeDescription & { readonly eventId: string })[];
}

/** Dates come from the core. Rows describe reviewed regional states or an explicitly linked Event. */
export const POLITICAL_DESCRIPTIONS: Readonly<Record<string, PoliticalDescription>> = {
  "akkadian-empire": {
    "centres": {
      "text": "阿卡德城。",
      "sourceIds": [
        "source-met-akkadian-period"
      ]
    },
    "core": {
      "text": "两河中部与南部城邦。",
      "sourceIds": [
        "source-met-akkadian-period"
      ]
    },
    "governance": {
      "text": "王权通过征服统合各城，继任国王继续维持统治。",
      "sourceIds": [
        "source-met-akkadian-period"
      ]
    },
    "phases": {
      "akkadian-imperial-order": {
        "scope": {
          "text": "两河中部与南部；势力北达两河上游。",
          "sourceIds": [
            "source-met-akkadian-period",
            "source-westenholz-kingdom-akkad",
            "source-frayne-sargonic-inscriptions"
          ]
        },
        "change": {
          "text": "征服南部城邦，建立跨地区王权。",
          "sourceIds": [
            "source-met-akkadian-period",
            "source-westenholz-kingdom-akkad",
            "source-frayne-sargonic-inscriptions"
          ]
        }
      },
      "akkadian-fragmentation": {
        "scope": {
          "text": "阿卡德城周边。",
          "sourceIds": [
            "source-met-akkadian-period"
          ]
        },
        "change": {
          "text": "王朝统治收缩至中心地区。",
          "sourceIds": [
            "source-met-akkadian-period"
          ]
        }
      }
    }
  },
  "ur-iii-kingdom": {
    "centres": {
      "text": "乌尔；尼普尔是重要宗教中心。",
      "sourceIds": [
        "source-garfinkle-kingdom-ur",
        "source-met-isin-larsa-old-babylonian",
        "source-steinkeller-ur-iii-core-periphery"
      ]
    },
    "core": {
      "text": "两河南部的城市与农业腹地。",
      "sourceIds": [
        "source-garfinkle-kingdom-ur",
        "source-met-isin-larsa-old-babylonian",
        "source-steinkeller-ur-iii-core-periphery"
      ]
    },
    "governance": {
      "text": "国王依靠贡赋征集与官员网络组织资源，书吏记录物资和劳役。",
      "sourceIds": [
        "source-garfinkle-kingdom-ur",
        "source-met-isin-larsa-old-babylonian",
        "source-steinkeller-ur-iii-core-periphery"
      ]
    },
    "phases": {
      "ur-iii-kingdom-order": {
        "scope": {
          "text": "以乌尔为中心的两河南部城邦。",
          "sourceIds": [
            "source-garfinkle-kingdom-ur",
            "source-steinkeller-ur-iii-core-periphery",
            "source-cambridge-ur-iii-old-babylonian-transition",
            "source-met-isin-larsa-old-babylonian"
          ]
        },
        "change": {
          "text": "王室通过官员与贡赋联结各城。",
          "sourceIds": [
            "source-garfinkle-kingdom-ur",
            "source-steinkeller-ur-iii-core-periphery",
            "source-cambridge-ur-iii-old-babylonian-transition",
            "source-met-isin-larsa-old-babylonian"
          ]
        }
      }
    }
  },
  "old-babylonian-kingdom": {
    "centres": {
      "text": "巴比伦。",
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian",
        "source-louvre-hammurabi-code"
      ]
    },
    "core": {
      "text": "巴比伦及两河中部地区。",
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian",
        "source-louvre-hammurabi-code"
      ]
    },
    "governance": {
      "text": "国王主持战争、营建和司法，以王室命令与裁判维护统治。",
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian",
        "source-louvre-hammurabi-code"
      ]
    },
    "phases": {
      "old-babylonian-city-kingdom-emergence": {
        "scope": {
          "text": "巴比伦及两河中部核心地区。",
          "sourceIds": [
            "source-met-isin-larsa-old-babylonian",
            "source-podany-hammurabi-babylon",
            "source-cdli-hammurabi-year-names",
            "source-cdli-samsuiluna-year-names",
            "source-louvre-hammurabi-code"
          ]
        },
        "change": {
          "text": "王朝持续以巴比伦为统治中心。",
          "sourceIds": [
            "source-met-isin-larsa-old-babylonian",
            "source-podany-hammurabi-babylon",
            "source-cdli-hammurabi-year-names",
            "source-cdli-samsuiluna-year-names",
            "source-louvre-hammurabi-code"
          ]
        }
      }
    },
    "events": [
      {
        "eventId": "event-hammurabi-conquests",
        "scope": {
          "text": "拉尔萨、埃什嫩纳与马里等城邦。",
          "sourceIds": [
            "source-cdli-hammurabi-year-names",
            "source-podany-hammurabi-babylon"
          ]
        },
        "change": {
          "text": "汉谟拉比发动征服战争，扩张王国势力。",
          "sourceIds": [
            "source-cdli-hammurabi-year-names",
            "source-podany-hammurabi-babylon"
          ]
        }
      }
    ]
  },
  "egypt-old-kingdom": {
    "centres": {
      "text": "孟菲斯。",
      "sourceIds": [
        "source-met-old-kingdom",
        "source-ucl-memphis-background"
      ]
    },
    "core": {
      "text": "尼罗河谷与三角洲。",
      "sourceIds": [
        "source-met-old-kingdom",
        "source-ucl-memphis-background"
      ]
    },
    "governance": {
      "text": "国王居于统治中心，宫廷官员与地方长官组织各地事务和王室工程。",
      "sourceIds": [
        "source-met-old-kingdom",
        "source-ucl-memphis-background"
      ]
    },
    "phases": {
      "egypt-old-kingdom-regional-presence": {
        "scope": {
          "text": "尼罗河谷与三角洲。",
          "sourceIds": [
            "source-met-old-kingdom",
            "source-muller-old-kingdom-end",
            "source-ucl-egypt-chronology",
            "source-ucl-memphis-background"
          ]
        },
        "change": {
          "text": "统一王权组织流域内的城市与农业地区。",
          "sourceIds": [
            "source-met-old-kingdom",
            "source-muller-old-kingdom-end",
            "source-ucl-egypt-chronology",
            "source-ucl-memphis-background"
          ]
        }
      }
    }
  },
  "egypt-middle-kingdom": {
    "centres": {
      "text": "底比斯；第十二王朝起以伊奇塔维为行政中心。",
      "sourceIds": [
        "source-met-middle-kingdom",
        "source-ucl-middle-kingdom",
        "source-ucl-middle-kingdom-guide",
        "source-ucl-nubia-middle-kingdom"
      ]
    },
    "core": {
      "text": "尼罗河谷与三角洲。",
      "sourceIds": [
        "source-met-middle-kingdom",
        "source-ucl-middle-kingdom",
        "source-ucl-middle-kingdom-guide",
        "source-ucl-nubia-middle-kingdom"
      ]
    },
    "governance": {
      "text": "王室通过官员和地方统治者治理各地，后期加强中央对地方的掌握。",
      "sourceIds": [
        "source-met-middle-kingdom",
        "source-ucl-middle-kingdom",
        "source-ucl-middle-kingdom-guide",
        "source-ucl-nubia-middle-kingdom"
      ]
    },
    "phases": {
      "egypt-middle-kingdom-reunification": {
        "scope": {
          "text": "尼罗河谷与三角洲。",
          "sourceIds": [
            "source-ucl-mentuhotep-ii",
            "source-ucl-middle-kingdom",
            "source-ucl-egypt-chronology",
            "source-met-middle-kingdom",
            "source-ucl-middle-kingdom-guide",
            "source-ucl-nubia-middle-kingdom"
          ]
        },
        "change": {
          "text": "底比斯王室重新统一埃及。",
          "sourceIds": [
            "source-ucl-mentuhotep-ii",
            "source-ucl-middle-kingdom",
            "source-ucl-egypt-chronology",
            "source-met-middle-kingdom",
            "source-ucl-middle-kingdom-guide",
            "source-ucl-nubia-middle-kingdom"
          ]
        }
      },
      "egypt-middle-kingdom-consolidated-order": {
        "scope": {
          "text": "埃及核心地区；势力延伸至下努比亚。",
          "sourceIds": [
            "source-ucl-middle-kingdom",
            "source-met-middle-kingdom",
            "source-ucl-nubia-middle-kingdom",
            "source-ucl-second-intermediate",
            "source-uee-second-intermediate",
            "source-ucl-egypt-chronology",
            "source-ucl-middle-kingdom-guide"
          ]
        },
        "change": {
          "text": "沿河设置要塞，拓展南方联系。",
          "sourceIds": [
            "source-ucl-middle-kingdom",
            "source-met-middle-kingdom",
            "source-ucl-nubia-middle-kingdom",
            "source-ucl-second-intermediate",
            "source-uee-second-intermediate",
            "source-ucl-egypt-chronology",
            "source-ucl-middle-kingdom-guide"
          ]
        }
      }
    }
  },
  "egypt-new-kingdom": {
    "centres": {
      "text": "底比斯与孟菲斯；阿玛尔纳时期以阿赫塔顿为王都，拉美西斯二世迁都皮拉美西斯。",
      "sourceIds": [
        "source-met-new-kingdom",
        "source-ucl-memphis-background",
        "source-met-akhenaten-city",
        "source-ucl-ramesses-ii",
        "source-ucl-egypt-asia-new-kingdom"
      ]
    },
    "core": {
      "text": "尼罗河谷与三角洲。",
      "sourceIds": [
        "source-met-new-kingdom",
        "source-ucl-memphis-background",
        "source-met-akhenaten-city",
        "source-ucl-ramesses-ii",
        "source-ucl-egypt-asia-new-kingdom"
      ]
    },
    "governance": {
      "text": "王室以官员和军队治理埃及及努比亚，并通过属国与驻军维持黎凡特的统治。",
      "sourceIds": [
        "source-met-new-kingdom",
        "source-ucl-memphis-background",
        "source-met-akhenaten-city",
        "source-ucl-ramesses-ii",
        "source-ucl-egypt-asia-new-kingdom"
      ]
    },
    "phases": {
      "egypt-new-kingdom-reunification": {
        "scope": {
          "text": "尼罗河谷与三角洲。",
          "sourceIds": [
            "source-ucl-ahmose",
            "source-met-new-kingdom",
            "source-ucl-egypt-chronology",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii",
            "source-ucl-egypt-asia-new-kingdom"
          ]
        },
        "change": {
          "text": "驱逐喜克索斯统治者，重新统一埃及。",
          "sourceIds": [
            "source-ucl-ahmose",
            "source-met-new-kingdom",
            "source-ucl-egypt-chronology",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii",
            "source-ucl-egypt-asia-new-kingdom"
          ]
        }
      },
      "egypt-new-kingdom-nubian-expansion": {
        "scope": {
          "text": "埃及核心地区与努比亚。",
          "sourceIds": [
            "source-ucl-ahmose",
            "source-met-new-kingdom",
            "source-ucl-egypt-chronology",
            "source-akmenkalns-nubian-egyptian-interactions",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii",
            "source-ucl-egypt-asia-new-kingdom"
          ]
        },
        "change": {
          "text": "沿尼罗河向南扩展统治。",
          "sourceIds": [
            "source-ucl-ahmose",
            "source-met-new-kingdom",
            "source-ucl-egypt-chronology",
            "source-akmenkalns-nubian-egyptian-interactions",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii",
            "source-ucl-egypt-asia-new-kingdom"
          ]
        }
      },
      "egypt-new-kingdom-imperial-court-order": {
        "scope": {
          "text": "埃及、努比亚及南黎凡特的属国与驻军据点。",
          "sourceIds": [
            "source-met-new-kingdom",
            "source-hayes-scepter-ii",
            "source-ucl-nubia-new-kingdom",
            "source-ucl-egypt-asia-new-kingdom",
            "source-ucl-ramesses-iv",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii"
          ]
        },
        "change": {
          "text": "通过远征与外交维持跨地区统治。",
          "sourceIds": [
            "source-met-new-kingdom",
            "source-hayes-scepter-ii",
            "source-ucl-nubia-new-kingdom",
            "source-ucl-egypt-asia-new-kingdom",
            "source-ucl-ramesses-iv",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii"
          ]
        }
      },
      "egypt-new-kingdom-fragmentation": {
        "scope": {
          "text": "尼罗河谷、三角洲与努比亚。",
          "sourceIds": [
            "source-turin-strike-papyrus",
            "source-uee-early-mid-20th-dynasty",
            "source-met-third-intermediate",
            "source-ucl-egypt-asia-new-kingdom",
            "source-ucl-ramesses-iv",
            "source-akmenkalns-nubian-egyptian-interactions",
            "source-met-new-kingdom",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii"
          ]
        },
        "change": {
          "text": "撤出南黎凡特，南方统治继续。",
          "sourceIds": [
            "source-turin-strike-papyrus",
            "source-uee-early-mid-20th-dynasty",
            "source-met-third-intermediate",
            "source-ucl-egypt-asia-new-kingdom",
            "source-ucl-ramesses-iv",
            "source-akmenkalns-nubian-egyptian-interactions",
            "source-met-new-kingdom",
            "source-ucl-memphis-background",
            "source-met-akhenaten-city",
            "source-ucl-ramesses-ii"
          ]
        }
      }
    }
  },
  "indus-civilization": {
    "centres": {
      "text": "哈拉帕、摩亨佐-达罗、拉基加里与多拉维拉。",
      "sourceIds": [
        "source-green-indus-public-goods",
        "source-wright-ancient-indus",
        "source-kenoyer-indus-civilisation"
      ]
    },
    "core": {
      "text": "印度河流域及南亚西北部的城市地区。",
      "sourceIds": [
        "source-green-indus-public-goods",
        "source-wright-ancient-indus",
        "source-kenoyer-indus-civilisation"
      ]
    },
    "governance": {
      "text": "城市居民组织街区建设、供水排水与专业手工业，跨城交换广泛使用标准化度量衡。",
      "sourceIds": [
        "source-green-indus-public-goods",
        "source-wright-ancient-indus",
        "source-kenoyer-indus-civilisation"
      ]
    },
    "phases": {
      "indus-civilization-core-presence": {
        "scope": {
          "text": "印度河流域及南亚西北部的城市地区。",
          "sourceIds": [
            "source-wright-ancient-indus",
            "source-kenoyer-indus-civilisation",
            "source-possehl-indus-mesopotamia",
            "source-giosan-harappan-transformation",
            "source-green-indus-public-goods"
          ]
        },
        "change": {
          "text": "规划街区、公共设施与跨城贸易相互联系。",
          "sourceIds": [
            "source-wright-ancient-indus",
            "source-kenoyer-indus-civilisation",
            "source-possehl-indus-mesopotamia",
            "source-giosan-harappan-transformation",
            "source-green-indus-public-goods"
          ]
        }
      }
    }
  },
  "western-zhou": {
    "centres": {
      "text": "丰镐（宗周），洛邑（成周）。",
      "sourceIds": [
        "source-li-feng-western-zhou-fall",
        "source-western-zhou-domain",
        "source-national-museum-da-yu-ding",
        "source-national-museum-ceming",
        "source-cook-western-zhou-rites",
        "source-hk-history-museum-zhou-organization"
      ]
    },
    "core": {
      "text": "关中渭河流域与洛阳盆地。",
      "sourceIds": [
        "source-li-feng-western-zhou-fall",
        "source-western-zhou-domain",
        "source-national-museum-da-yu-ding",
        "source-national-museum-ceming",
        "source-cook-western-zhou-rites",
        "source-hk-history-museum-zhou-organization"
      ]
    },
    "governance": {
      "text": "周王授予贵族土地、人口与职事，以宗族关系、朝贡和军事义务联系各地封国。",
      "sourceIds": [
        "source-li-feng-western-zhou-fall",
        "source-western-zhou-domain",
        "source-national-museum-da-yu-ding",
        "source-national-museum-ceming",
        "source-cook-western-zhou-rites",
        "source-hk-history-museum-zhou-organization"
      ]
    },
    "phases": {
      "western-zhou-regional-rule": {
        "scope": {
          "text": "关中、洛阳与东方封国。",
          "sourceIds": [
            "source-national-museum-li-gui",
            "source-national-museum-da-yu-ding",
            "source-national-museum-ceming",
            "source-western-zhou-domain",
            "source-cook-western-zhou-rites",
            "source-li-feng-early-china",
            "source-li-feng-western-zhou-fall",
            "source-hk-history-museum-zhou-organization"
          ]
        },
        "change": {
          "text": "王室通过册命和贵族封国联系各地。",
          "sourceIds": [
            "source-national-museum-li-gui",
            "source-national-museum-da-yu-ding",
            "source-national-museum-ceming",
            "source-western-zhou-domain",
            "source-cook-western-zhou-rites",
            "source-li-feng-early-china",
            "source-li-feng-western-zhou-fall",
            "source-hk-history-museum-zhou-organization"
          ]
        }
      }
    }
  },
  "shang-civilization": {
    "centres": {
      "text": "早期以郑州商城等为中心；晚期王都位于安阳殷墟。",
      "sourceIds": [
        "source-an-zhengzhou-shang-city",
        "source-bagley-shang-archaeology",
        "source-unesco-yinxu",
        "source-smithsonian-shang-dynasty",
        "source-keightley-ancestral-landscape"
      ]
    },
    "core": {
      "text": "黄河中游与华北平原。",
      "sourceIds": [
        "source-an-zhengzhou-shang-city",
        "source-bagley-shang-archaeology",
        "source-unesco-yinxu",
        "source-smithsonian-shang-dynasty",
        "source-keightley-ancestral-landscape"
      ]
    },
    "governance": {
      "text": "商王掌握军事与祭祀权力，通过王室和地方贵族组织各地事务。",
      "sourceIds": [
        "source-an-zhengzhou-shang-city",
        "source-bagley-shang-archaeology",
        "source-unesco-yinxu",
        "source-smithsonian-shang-dynasty",
        "source-keightley-ancestral-landscape"
      ]
    },
    "phases": {
      "shang-regional-rule": {
        "scope": {
          "text": "黄河中游与华北平原的王室、贵族据点。",
          "sourceIds": [
            "source-an-zhengzhou-shang-city",
            "source-steinke-erligang",
            "source-bagley-shang-archaeology",
            "source-keightley-ancestral-landscape",
            "source-unesco-yinxu",
            "source-national-museum-li-gui",
            "source-anyang-fall",
            "source-khayutina-cultural-memory",
            "source-smithsonian-shang-dynasty"
          ]
        },
        "change": {
          "text": "以王都与地方政治中心构成统治网络。",
          "sourceIds": [
            "source-an-zhengzhou-shang-city",
            "source-steinke-erligang",
            "source-bagley-shang-archaeology",
            "source-keightley-ancestral-landscape",
            "source-unesco-yinxu",
            "source-national-museum-li-gui",
            "source-anyang-fall",
            "source-khayutina-cultural-memory",
            "source-smithsonian-shang-dynasty"
          ]
        }
      }
    }
  },
  "hittite-empire": {
    "centres": {
      "text": "哈图沙为主要王都，曾迁都塔尔洪塔沙。",
      "sourceIds": [
        "source-met-hittites",
        "source-beckman-hittite-diplomatic-texts"
      ]
    },
    "core": {
      "text": "安纳托利亚中部。",
      "sourceIds": [
        "source-met-hittites",
        "source-beckman-hittite-diplomatic-texts"
      ]
    },
    "governance": {
      "text": "王室统领核心领地，通过王族驻地和条约管理附属王国。",
      "sourceIds": [
        "source-met-hittites",
        "source-beckman-hittite-diplomatic-texts"
      ]
    },
    "phases": {
      "hittite-early-central-kingship": {
        "scope": {
          "text": "安纳托利亚中部。",
          "sourceIds": [
            "source-bryce-hittite-kingdom",
            "source-unesco-hattusha",
            "source-met-hittites",
            "source-beckman-hittite-diplomatic-texts"
          ]
        },
        "change": {
          "text": "以哈图沙为中心建立王国。",
          "sourceIds": [
            "source-bryce-hittite-kingdom",
            "source-unesco-hattusha",
            "source-met-hittites",
            "source-beckman-hittite-diplomatic-texts"
          ]
        }
      },
      "hittite-syrian-control": {
        "scope": {
          "text": "安纳托利亚中部与叙利亚部分地区。",
          "sourceIds": [
            "source-bryce-hittite-kingdom",
            "source-met-hittites",
            "source-beckman-hittite-diplomatic-texts",
            "source-bm-kadesh-sallier",
            "source-spalinger-war-egypt",
            "source-un-egypt-hatti-treaty",
            "source-bryce-neo-hittite-kingdoms"
          ]
        },
        "change": {
          "text": "王族驻地与附庸条约连接南方领地。",
          "sourceIds": [
            "source-bryce-hittite-kingdom",
            "source-met-hittites",
            "source-beckman-hittite-diplomatic-texts",
            "source-bm-kadesh-sallier",
            "source-spalinger-war-egypt",
            "source-un-egypt-hatti-treaty",
            "source-bryce-neo-hittite-kingdoms"
          ]
        }
      }
    }
  },
  "ugarit-kingdom": {
    "centres": {
      "text": "乌加里特王城；米奈特贝达港。",
      "sourceIds": [
        "source-met-ugarit",
        "source-french-ugarit-history"
      ]
    },
    "core": {
      "text": "叙利亚北部沿海、乌加里特周边。",
      "sourceIds": [
        "source-met-ugarit",
        "source-french-ugarit-history"
      ]
    },
    "governance": {
      "text": "本地王室和宫廷官员管理城镇与乡村，后期向赫梯纳贡。",
      "sourceIds": [
        "source-met-ugarit",
        "source-french-ugarit-history"
      ]
    },
    "phases": {
      "ugarit-kingdom-presence": {
        "scope": {
          "text": "乌加里特王城、港口与周边乡村。",
          "sourceIds": [
            "source-yon-city-of-ugarit",
            "source-met-ugarit",
            "source-french-ugarit-history",
            "source-leriche-ugarit-after-1180"
          ]
        },
        "change": {
          "text": "王室统治沿海腹地，经营内陆与海上往来。",
          "sourceIds": [
            "source-yon-city-of-ugarit",
            "source-met-ugarit",
            "source-french-ugarit-history",
            "source-leriche-ugarit-after-1180"
          ]
        }
      }
    }
  },
  "minoan-palatial-civilization": {
    "centres": {
      "text": "克诺索斯、费斯托斯、马利亚、扎克罗斯。",
      "sourceIds": [
        "source-unesco-minoan-palatial-centres",
        "source-met-minoan-crete"
      ]
    },
    "core": {
      "text": "克里特岛各宫殿及周边聚落。",
      "sourceIds": [
        "source-unesco-minoan-palatial-centres",
        "source-met-minoan-crete"
      ]
    },
    "governance": {
      "text": "各宫殿组织周边地区的物资储藏、生产与祭仪，并通过海路交换物产。",
      "sourceIds": [
        "source-unesco-minoan-palatial-centres",
        "source-met-minoan-crete"
      ]
    },
    "phases": {
      "minoan-first-palatial-centres": {
        "scope": {
          "text": "克里特岛各宫殿及周边聚落。",
          "sourceIds": [
            "source-unesco-minoan-palatial-centres",
            "source-met-minoan-crete",
            "source-salgarella-writing-bronze-age-crete",
            "source-bsa-linear-b"
          ]
        },
        "change": {
          "text": "多座宫殿分别组织生产、储藏与祭仪。",
          "sourceIds": [
            "source-unesco-minoan-palatial-centres",
            "source-met-minoan-crete",
            "source-salgarella-writing-bronze-age-crete",
            "source-bsa-linear-b"
          ]
        }
      },
      "minoan-knossos-linear-b-reorganization": {
        "scope": {
          "text": "克里特的克诺索斯宫殿与城市。",
          "sourceIds": [
            "source-heraklion-knossos-reviewed",
            "source-salgarella-writing-bronze-age-crete",
            "source-unesco-minoan-palatial-centres",
            "source-met-minoan-crete"
          ]
        },
        "change": {
          "text": "宫殿行政延续，并采用线形文字B。",
          "sourceIds": [
            "source-heraklion-knossos-reviewed",
            "source-salgarella-writing-bronze-age-crete",
            "source-unesco-minoan-palatial-centres",
            "source-met-minoan-crete"
          ]
        }
      }
    }
  },
  "mycenaean-civilization": {
    "centres": {
      "text": "迈锡尼、梯林斯、皮洛斯与底比斯。",
      "sourceIds": [
        "source-met-mycenaean-civilization",
        "source-killen-mycenaean-society"
      ]
    },
    "core": {
      "text": "伯罗奔尼撒及希腊中部的宫殿地区。",
      "sourceIds": [
        "source-met-mycenaean-civilization",
        "source-killen-mycenaean-society"
      ]
    },
    "governance": {
      "text": "各宫殿由国王及官员组织生产和物资分配，书吏用线形文字B记账。",
      "sourceIds": [
        "source-met-mycenaean-civilization",
        "source-killen-mycenaean-society"
      ]
    },
    "phases": {
      "mycenaean-palatial-administration": {
        "scope": {
          "text": "希腊大陆的城市与宫殿中心。",
          "sourceIds": [
            "source-killen-mycenaean-society",
            "source-bsa-linear-b",
            "source-cambridge-mycenaean-religion",
            "source-met-mycenaean-civilization",
            "source-cambridge-guide-mycenae",
            "source-deger-jalkotzy-aftermath",
            "source-knapp-manning-crisis",
            "source-cambridge-mycenaean-transformation"
          ]
        },
        "change": {
          "text": "各中心经营农业、手工业与海上交流。",
          "sourceIds": [
            "source-killen-mycenaean-society",
            "source-bsa-linear-b",
            "source-cambridge-mycenaean-religion",
            "source-met-mycenaean-civilization",
            "source-cambridge-guide-mycenae",
            "source-deger-jalkotzy-aftermath",
            "source-knapp-manning-crisis",
            "source-cambridge-mycenaean-transformation"
          ]
        }
      }
    }
  },
  "greek-dark-age-communities": {
    "centres": {
      "text": "梯林斯、雅典、莱夫坎迪等聚落。",
      "sourceIds": [
        "source-cambridge-mycenaean-transformation",
        "source-cambridge-greek-iron-age-pottery",
        "source-oxford-lefkandi-reviewed"
      ]
    },
    "core": {
      "text": "希腊大陆与爱琴海岛屿。",
      "sourceIds": [
        "source-cambridge-mycenaean-transformation",
        "source-cambridge-greek-iron-age-pottery",
        "source-oxford-lefkandi-reviewed"
      ]
    },
    "governance": {
      "text": "生活围绕地方聚落和小型社群展开，各地通过交换、竞争与往来保持联系。",
      "sourceIds": [
        "source-cambridge-mycenaean-transformation",
        "source-cambridge-greek-iron-age-pottery",
        "source-oxford-lefkandi-reviewed"
      ]
    },
    "phases": {
      "greek-postpalatial-local-communities": {
        "scope": {
          "text": "希腊大陆与爱琴海岛屿的地方聚落。",
          "sourceIds": [
            "source-deger-jalkotzy-aftermath",
            "source-cambridge-mycenaean-transformation",
            "source-bsa-aegean-iron-technologies",
            "source-cambridge-greek-iron-age-pottery",
            "source-oxford-lefkandi-reviewed"
          ]
        },
        "change": {
          "text": "宫殿体系结束后，以地方社群组织生活。",
          "sourceIds": [
            "source-deger-jalkotzy-aftermath",
            "source-cambridge-mycenaean-transformation",
            "source-bsa-aegean-iron-technologies",
            "source-cambridge-greek-iron-age-pottery",
            "source-oxford-lefkandi-reviewed"
          ]
        }
      }
    }
  },
  "assur-community": {
    "centres": {
      "text": "亚述城；古亚述商人在卡尼什设有商贸社群。",
      "sourceIds": [
        "source-met-old-assyrian-community-reviewed",
        "source-met-assyrian-caravan-object-reviewed",
        "source-oracc-assyrian-heartland-reviewed"
      ]
    },
    "core": {
      "text": "底格里斯河畔的亚述城及周边地区。",
      "sourceIds": [
        "source-met-old-assyrian-community-reviewed",
        "source-met-assyrian-caravan-object-reviewed",
        "source-oracc-assyrian-heartland-reviewed"
      ]
    },
    "governance": {
      "text": "古亚述时期，统治者与城市议会共同处理公共事务，商人家族组织商队和异地交易。",
      "sourceIds": [
        "source-met-old-assyrian-community-reviewed",
        "source-met-assyrian-caravan-object-reviewed",
        "source-oracc-assyrian-heartland-reviewed"
      ]
    },
    "phases": {
      "assur-old-assyrian-trade-community": {
        "scope": {
          "text": "亚述城；商贸网络通向卡尼什等安纳托利亚据点。",
          "sourceIds": [
            "source-met-old-assyrian-community-reviewed",
            "source-met-assyrian-caravan-object-reviewed",
            "source-oracc-assyrian-heartland-reviewed"
          ]
        },
        "change": {
          "text": "商人家族组织商队和异地交易。",
          "sourceIds": [
            "source-met-old-assyrian-community-reviewed",
            "source-met-assyrian-caravan-object-reviewed",
            "source-oracc-assyrian-heartland-reviewed"
          ]
        }
      },
      "assur-middle-assyrian-urban-tradition": {
        "scope": {
          "text": "两河北部的亚述城。",
          "sourceIds": [
            "source-oracc-assyrian-heartland-reviewed",
            "source-met-old-assyrian-community-reviewed",
            "source-met-assyrian-caravan-object-reviewed"
          ]
        },
        "change": {
          "text": "城市继续承担宗教与政治职能。",
          "sourceIds": [
            "source-oracc-assyrian-heartland-reviewed",
            "source-met-old-assyrian-community-reviewed",
            "source-met-assyrian-caravan-object-reviewed"
          ]
        }
      }
    }
  },
  "kingdom-of-judah": {
    "centres": {
      "text": "耶路撒冷。",
      "sourceIds": [
        "source-met-judean-diaspora-reviewed",
        "source-bm-babylonian-chronicle"
      ]
    },
    "core": {
      "text": "耶路撒冷及犹大地区。",
      "sourceIds": [
        "source-met-judean-diaspora-reviewed",
        "source-bm-babylonian-chronicle"
      ]
    },
    "governance": {
      "text": "国王与宫廷治理地方；后期向外部帝国纳贡，巴比伦曾册立当地国王。",
      "sourceIds": [
        "source-met-judean-diaspora-reviewed",
        "source-bm-babylonian-chronicle"
      ]
    },
    "phases": {
      "judah-kingdom-presence": {
        "scope": {
          "text": "耶路撒冷及犹大地区。",
          "sourceIds": [
            "source-met-ancient-israel",
            "source-bm-lachish",
            "source-bm-babylonian-chronicle",
            "source-met-judean-diaspora-reviewed"
          ]
        },
        "change": {
          "text": "在帝国压力下延续，最终被巴比伦攻灭。",
          "sourceIds": [
            "source-met-ancient-israel",
            "source-bm-lachish",
            "source-bm-babylonian-chronicle",
            "source-met-judean-diaspora-reviewed"
          ]
        }
      }
    }
  },
  "neo-assyrian-empire": {
    "centres": {
      "text": "亚述城、卡尔胡、杜尔沙鲁金与尼尼微先后承担王都职能。",
      "sourceIds": [
        "source-met-assyria",
        "source-bm-introducing-assyrians",
        "source-oracc-governance-reviewed"
      ]
    },
    "core": {
      "text": "底格里斯河上游，亚述城至尼尼微一带。",
      "sourceIds": [
        "source-met-assyria",
        "source-bm-introducing-assyrians",
        "source-oracc-governance-reviewed"
      ]
    },
    "governance": {
      "text": "国王统领军队与官僚，行省官员、书吏和驿传网络共同管理帝国。",
      "sourceIds": [
        "source-met-assyria",
        "source-bm-introducing-assyrians",
        "source-oracc-governance-reviewed"
      ]
    },
    "phases": {
      "neo-assyrian-expansion": {
        "scope": {
          "text": "上美索不达米亚。",
          "sourceIds": [
            "source-met-assyria",
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-introducing-assyrians"
          ]
        },
        "change": {
          "text": "以两河北部为核心，逐步向西用兵。",
          "sourceIds": [
            "source-met-assyria",
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-introducing-assyrians"
          ]
        }
      },
      "neo-assyrian-syrian-provinces": {
        "scope": {
          "text": "两河北部与北叙利亚征服地区。",
          "sourceIds": [
            "source-met-assyria",
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-introducing-assyrians",
            "source-oracc-tiglath-pileser-territory-reviewed"
          ]
        },
        "change": {
          "text": "吞并阿尔帕德，建立西部行省。",
          "sourceIds": [
            "source-met-assyria",
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-introducing-assyrians",
            "source-oracc-tiglath-pileser-territory-reviewed"
          ]
        }
      },
      "neo-assyrian-imperial-administration": {
        "scope": {
          "text": "两河北部、叙利亚及南黎凡特部分地区。",
          "sourceIds": [
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-ashurbanipal-library",
            "source-oracc-tiglath-pileser-territory-reviewed",
            "source-oracc-israel",
            "source-eshel-silver-levant-2025",
            "source-met-assyria",
            "source-bm-introducing-assyrians"
          ]
        },
        "change": {
          "text": "吞并大马士革及以色列北部，行省延伸至米吉多。",
          "sourceIds": [
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-ashurbanipal-library",
            "source-oracc-tiglath-pileser-territory-reviewed",
            "source-oracc-israel",
            "source-eshel-silver-levant-2025",
            "source-met-assyria",
            "source-bm-introducing-assyrians"
          ]
        }
      },
      "neo-assyrian-western-contraction": {
        "scope": {
          "text": "两河北部与北叙利亚部分地区。",
          "sourceIds": [
            "source-met-assyria",
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-introducing-assyrians",
            "source-eshel-silver-levant-2025",
            "source-bm-fall-nineveh-chronicle-reviewed"
          ]
        },
        "change": {
          "text": "退出南黎凡特，西部控制收缩。",
          "sourceIds": [
            "source-met-assyria",
            "source-oracc-governance-reviewed",
            "source-oracc-deportation",
            "source-bm-introducing-assyrians",
            "source-eshel-silver-levant-2025",
            "source-bm-fall-nineveh-chronicle-reviewed"
          ]
        }
      },
      "neo-assyrian-collapse": {
        "scope": {
          "text": "哈兰一带。",
          "sourceIds": [
            "source-met-assyria",
            "source-bm-fall-nineveh-chronicle-reviewed",
            "source-bm-introducing-assyrians",
            "source-oracc-governance-reviewed"
          ]
        },
        "change": {
          "text": "尼尼微陷落后，残余王权重整并最终失去据点。",
          "sourceIds": [
            "source-met-assyria",
            "source-bm-fall-nineveh-chronicle-reviewed",
            "source-bm-introducing-assyrians",
            "source-oracc-governance-reviewed"
          ]
        }
      }
    }
  },
  "kingdom-of-israel": {
    "centres": {
      "text": "后期以撒马利亚为王都。",
      "sourceIds": [
        "source-oracc-israel-reviewed",
        "source-met-judean-diaspora-reviewed"
      ]
    },
    "core": {
      "text": "撒马利亚及周边地区。",
      "sourceIds": [
        "source-oracc-israel-reviewed",
        "source-met-judean-diaspora-reviewed"
      ]
    },
    "governance": {
      "text": "本地国王统治，曾作为亚述的附庸纳贡；吞并后改设亚述行省。",
      "sourceIds": [
        "source-oracc-israel-reviewed",
        "source-met-judean-diaspora-reviewed"
      ]
    },
    "phases": {
      "israel-kingdom-presence": {
        "scope": {
          "text": "撒马利亚及北方王国地区。",
          "sourceIds": [
            "source-met-ancient-israel",
            "source-bm-black-obelisk",
            "source-oracc-israel",
            "source-oracc-israel-reviewed",
            "source-met-judean-diaspora-reviewed"
          ]
        },
        "change": {
          "text": "经历纳贡、战争与亚述吞并。",
          "sourceIds": [
            "source-met-ancient-israel",
            "source-bm-black-obelisk",
            "source-oracc-israel",
            "source-oracc-israel-reviewed",
            "source-met-judean-diaspora-reviewed"
          ]
        }
      }
    }
  },
  "neo-babylonian-empire": {
    "centres": {
      "text": "巴比伦。",
      "sourceIds": [
        "source-met-babylon"
      ]
    },
    "core": {
      "text": "巴比伦及两河下游城市地区。",
      "sourceIds": [
        "source-met-babylon"
      ]
    },
    "governance": {
      "text": "王室通过战争和人口迁移巩固帝国，并以神庙祭仪与营建彰显王权。",
      "sourceIds": [
        "source-met-babylon"
      ]
    },
    "phases": {
      "neo-babylonian-rise-against-assyria": {
        "scope": {
          "text": "以巴比伦为中心的两河中部。",
          "sourceIds": [
            "source-met-babylon",
            "source-met-assyria"
          ]
        },
        "change": {
          "text": "摆脱亚述统治，参加推翻亚述的战争。",
          "sourceIds": [
            "source-met-babylon",
            "source-met-assyria"
          ]
        }
      },
      "neo-babylonian-capital-and-rule": {
        "scope": {
          "text": "巴比伦核心及叙利亚；势力延伸至南黎凡特。",
          "sourceIds": [
            "source-met-babylon-lion",
            "source-met-nebuchadnezzar-cylinder",
            "source-bm-cyrus-cylinder",
            "source-met-babylon",
            "source-bm-babylonian-chronicle",
            "source-met-cyrus-return"
          ]
        },
        "change": {
          "text": "西向扩张并持续经营帝国与首都。",
          "sourceIds": [
            "source-met-babylon-lion",
            "source-met-nebuchadnezzar-cylinder",
            "source-bm-cyrus-cylinder",
            "source-met-babylon",
            "source-bm-babylonian-chronicle",
            "source-met-cyrus-return"
          ]
        }
      }
    }
  },
  "lydian-kingdom": {
    "centres": {
      "text": "萨第斯。",
      "sourceIds": [
        "source-sardis-introduction-reviewed"
      ]
    },
    "core": {
      "text": "萨第斯及赫尔穆斯河谷。",
      "sourceIds": [
        "source-sardis-introduction-reviewed"
      ]
    },
    "governance": {
      "text": "王位世袭，王室掌握金银资源，并向周边城市扩展统治。",
      "sourceIds": [
        "source-sardis-introduction-reviewed"
      ]
    },
    "phases": {
      "lydian-kingdom-presence": {
        "scope": {
          "text": "萨第斯及安纳托利亚西部。",
          "sourceIds": [
            "source-met-sardis",
            "source-sardis-introduction",
            "source-iranica-cyrus",
            "source-sardis-introduction-reviewed"
          ]
        },
        "change": {
          "text": "以河谷为核心，向周边城市扩展势力。",
          "sourceIds": [
            "source-met-sardis",
            "source-sardis-introduction",
            "source-iranica-cyrus",
            "source-sardis-introduction-reviewed"
          ]
        }
      }
    }
  }
};

export function politicalClaims(description: PoliticalDescription): readonly PoliticalClaim[] {
  return [description.centres, description.core, description.governance,
    ...Object.values(description.phases).flatMap(row => [row.scope, row.change]),
    ...(description.events ?? []).flatMap(row => [row.scope, row.change])];
}
