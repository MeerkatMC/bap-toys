// scripts/main.ts
import { world as world2 } from "@minecraft/server";

// scripts/custom_loot.ts
import { ItemStack } from "@minecraft/server";
var CustomPlayerKillMobLoot = class {
  constructor(loot_table) {
    this.loot_table = loot_table;
  }
  /* constructor() */
  onEntityDie(entityDieAfterEvent) {
    const { deadEntity, damageSource: { damagingEntity } } = entityDieAfterEvent;
    if (damagingEntity === void 0 || damagingEntity.typeId !== "minecraft:player")
      return;
    const mob_entry = this.loot_table[deadEntity.typeId];
    if (mob_entry) {
      let mob_loot_array = null;
      let mob_loot_player_drop = mob_entry.player_drop !== void 0 ? mob_entry.player_drop : false;
      switch (mob_entry.type) {
        case 0 /* Basic */:
          mob_loot_array = mob_entry.loot;
          break;
        case 1 /* Variant */:
          {
            let vc = deadEntity.getComponent("minecraft:variant");
            if (vc !== void 0) {
              const variant = mob_entry.vars.find((v) => v.variant === vc.value);
              if (variant) {
                mob_loot_array = variant.loot;
              }
            }
          }
          break;
        case 2 /* MarkVariant */:
          {
            let vc = deadEntity.getComponent("minecraft:variant");
            let mv = deadEntity.getComponent("minecraft:mark_variant");
            if (vc !== void 0 && mv !== void 0) {
              const variant = mob_entry.mark_vars.find((v) => v.variant === vc.value && v.mark_variant === mv.value);
              if (variant) {
                mob_loot_array = variant.loot;
              }
            }
          }
          break;
        case 3 /* ClimateVariant */:
          {
            let cv = deadEntity.getProperty("minecraft:climate_variant");
            if (cv !== void 0) {
              const variant = mob_entry.climate_vars.find((v) => v.climnate_variant === cv);
              if (variant) {
                mob_loot_array = variant.loot;
                console.log("Climate Variant: ", cv);
              }
            }
          }
          break;
        default:
          break;
      }
      if (mob_loot_array) {
        const lootItem = this.get_random_loot(mob_loot_array, mob_entry.chance, mob_entry.rolls);
        if (lootItem) {
          console.log("Spawn loot: ", lootItem.itemId);
          if (mob_loot_player_drop)
            damagingEntity.dimension.spawnItem(new ItemStack(lootItem.itemId, lootItem.amount), damagingEntity.location);
          else
            damagingEntity.dimension.spawnItem(new ItemStack(lootItem.itemId, lootItem.amount), deadEntity.location);
        }
      }
    }
  }
  get_random_loot(mob_loot_array, mob_loot_chance, mob_loot_rolls) {
    let random = Math.random();
    if (random < mob_loot_chance) {
      let totalWeight = mob_loot_array.reduce((sum, lootItem) => sum + lootItem.weight, 0);
      let randomLootValue = Math.random() * totalWeight;
      for (let i = 0; i < mob_loot_rolls; i++) {
        let weightSum = 0;
        for (let lootItem of mob_loot_array) {
          weightSum += lootItem.weight;
          if (randomLootValue <= weightSum) {
            return lootItem.itemId ? lootItem : null;
          }
        }
      }
    }
    return null;
  }
};

// scripts/creaking_toy.ts
import { ItemStack as ItemStack2 } from "@minecraft/server";
var CreakingToyDrop = class {
  constructor(drop_chance, drop_item) {
    this.drop_chance = drop_chance;
    this.drop_item = drop_item;
  }
  /* constructor() */
  onEntityHit(entityHitEntity) {
    const { hitEntity, damagingEntity } = entityHitEntity;
    if (damagingEntity === void 0 || hitEntity === void 0)
      return;
    if (hitEntity.typeId !== "minecraft:creaking" || damagingEntity.typeId !== "minecraft:player")
      return;
    if (Math.random() < this.drop_chance) {
      hitEntity.dimension.spawnItem(new ItemStack2(this.drop_item, 1), hitEntity.location);
    }
  }
};

// scripts/main.ts
var mob_loot_table = {
  "minecraft:allay": {
    chance: 1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_allay", amount: 1, weight: 1 }
    ]
  },
  "minecraft:armadillo": {
    chance: 0.2,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_armadillo", amount: 1, weight: 1 },
      { itemId: "toy:toy_armadillo_rolled", amount: 1, weight: 1 }
    ]
  },
  "minecraft:axolotl": {
    chance: 0.1,
    rolls: 1,
    type: 1 /* Variant */,
    vars: [
      {
        variant: 0,
        loot: [
          { itemId: "toy:toy_axolotl_lucy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        loot: [
          { itemId: "toy:toy_axolotl_cyan", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        loot: [
          { itemId: "toy:toy_axolotl_gold", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        loot: [
          { itemId: "toy:toy_axolotl_wild", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        loot: [
          { itemId: "toy:toy_axolotl_blue", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:bat": {
    chance: 1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_bat", amount: 1, weight: 1 }
    ]
  },
  "minecraft:bee": {
    chance: 0.2,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_bee", amount: 1, weight: 2 },
      { itemId: "toy:toy_bee_angry", amount: 1, weight: 1 }
    ]
  },
  "minecraft:blaze": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_blaze", amount: 1, weight: 1 }
    ]
  },
  "minecraft:bogged": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_bogged", amount: 1, weight: 1 }
    ]
  },
  "minecraft:breeze": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_breeze", amount: 1, weight: 1 }
    ]
  },
  "minecraft:camel": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_camel", amount: 1, weight: 2 },
      { itemId: "toy:toy_camel_saddled", amount: 1, weight: 1 }
    ]
  },
  "minecraft:cat": {
    chance: 1,
    rolls: 1,
    type: 1 /* Variant */,
    vars: [
      {
        variant: 0,
        loot: [
          { itemId: "toy:toy_cat_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        loot: [
          { itemId: "toy:toy_cat_tuxedo", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        loot: [
          { itemId: "toy:toy_cat_red", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        loot: [
          { itemId: "toy:toy_cat_siamese", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        loot: [
          { itemId: "toy:toy_cat_british_shorthair", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        loot: [
          { itemId: "toy:toy_cat_calico", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        loot: [
          { itemId: "toy:toy_cat_persian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        loot: [
          { itemId: "toy:toy_cat_ragdoll", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        loot: [
          { itemId: "toy:toy_cat_tabby", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        loot: [
          { itemId: "toy:toy_cat_black", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        loot: [
          { itemId: "toy:toy_cat_jellie", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:cave_spider": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_cave_spider", amount: 1, weight: 1 }
    ]
  },
  "minecraft:chicken": {
    chance: 0.05,
    rolls: 1,
    type: 3 /* ClimateVariant */,
    climate_vars: [
      {
        climnate_variant: "temperate",
        loot: [
          { itemId: "toy:toy_chicken", amount: 1, weight: 1 }
        ]
      },
      {
        climnate_variant: "warm",
        loot: [
          { itemId: "toy:toy_chicken_warm", amount: 1, weight: 1 }
        ]
      },
      {
        climnate_variant: "cold",
        loot: [
          { itemId: "toy:toy_chicken_cold", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:cod": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_cod", amount: 1, weight: 1 }
    ]
  },
  "minecraft:cow": {
    chance: 0.01,
    rolls: 1,
    type: 3 /* ClimateVariant */,
    climate_vars: [
      {
        climnate_variant: "temperate",
        loot: [
          { itemId: "toy:toy_cow", amount: 1, weight: 1 }
        ]
      },
      {
        climnate_variant: "warm",
        loot: [
          { itemId: "toy:toy_cow_warm", amount: 1, weight: 1 }
        ]
      },
      {
        climnate_variant: "cold",
        loot: [
          { itemId: "toy:toy_cow_cold", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:creeper": {
    chance: 0.05,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_creeper", amount: 1, weight: 3 },
      { itemId: "toy:toy_creeper_charged", amount: 1, weight: 1 }
    ]
  },
  "minecraft:dolphin": {
    chance: 0.3,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_dolphin", amount: 1, weight: 1 }
    ]
  },
  "minecraft:donkey": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_donkey", amount: 1, weight: 3 },
      { itemId: "toy:toy_donkey_saddled", amount: 1, weight: 2 },
      { itemId: "toy:toy_donkey_saddle_chest", amount: 1, weight: 1 }
    ]
  },
  "minecraft:drowned": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_drowned", amount: 1, weight: 1 }
    ]
  },
  "minecraft:elder_guardian": {
    chance: 1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_guardian_elder", amount: 1, weight: 1 }
    ]
  },
  "minecraft:ender_dragon": {
    chance: 1,
    /* 100% drop rate */
    rolls: 1,
    player_drop: true,
    /* drop at player not mob */
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_ender_dragon", amount: 1, weight: 1 }
    ]
  },
  "minecraft:enderman": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_enderman", amount: 1, weight: 1 }
    ]
  },
  "minecraft:endermite": {
    chance: 0.7,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_endermite", amount: 1, weight: 1 }
    ]
  },
  "minecraft:evocation_illager": {
    chance: 0.02,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_evoker", amount: 1, weight: 1 }
    ]
  },
  "minecraft:fox": {
    chance: 0.1,
    rolls: 1,
    type: 1 /* Variant */,
    vars: [
      {
        variant: 0,
        loot: [
          { itemId: "toy:toy_fox", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        loot: [
          { itemId: "toy:toy_arctic_fox", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:frog": {
    chance: 0.1,
    rolls: 1,
    type: 1 /* Variant */,
    vars: [
      {
        variant: 0,
        loot: [
          { itemId: "toy:toy_frog_temperate", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        loot: [
          { itemId: "toy:toy_frog_cold", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        loot: [
          { itemId: "toy:toy_frog_warm", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:ghast": {
    chance: 0.05,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_ghast", amount: 1, weight: 1 }
    ]
  },
  "minecraft:glow_squid": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_glow_squid", amount: 1, weight: 1 }
    ]
  },
  "minecraft:goat": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_goat", amount: 1, weight: 3 },
      { itemId: "toy:toy_goat_one_horn", amount: 1, weight: 1 },
      { itemId: "toy:toy_goat_no_horn", amount: 1, weight: 1 }
    ]
  },
  "minecraft:guardian": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_guardian", amount: 1, weight: 1 }
    ]
  },
  "minecraft:hoglin": {
    chance: 0.03,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_hoglin", amount: 1, weight: 1 }
    ]
  },
  "minecraft:horse": {
    chance: 0.2,
    rolls: 1,
    type: 2 /* MarkVariant */,
    mark_vars: [
      {
        variant: 0,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_horse_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 0,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_horse_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 0,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_horse_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 0,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_horse_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 0,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_horse_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_horse_creamy", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_creamy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_horse_creamy", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_creamy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_horse_creamy", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_creamy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_horse_creamy", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_creamy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_horse_creamy", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_creamy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_horse_chestnut", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_chestnut", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_horse_chestnut", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_chestnut", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_horse_chestnut", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_chestnut", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_horse_chestnut", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_chestnut", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_horse_chestnut", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_chestnut", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_horse_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_horse_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_horse_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_horse_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_horse_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_horse_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_black", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_horse_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_black", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_horse_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_black", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_horse_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_black", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_horse_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_black", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_horse_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_gray", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_horse_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_gray", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_horse_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_gray", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_horse_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_gray", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_horse_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_gray", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_horse_dark_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_dark_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_horse_dark_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_dark_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_horse_dark_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_dark_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_horse_dark_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_dark_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_horse_dark_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_horse_saddled_dark_brown", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:husk": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_husk", amount: 1, weight: 1 }
    ]
  },
  "minecraft:iron_golem": {
    chance: 0.05,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_iron_golem", amount: 1, weight: 1 }
    ]
  },
  "minecraft:llama": {
    chance: 0.25,
    rolls: 1,
    type: 2 /* MarkVariant */,
    mark_vars: [
      /* 0: plains */
      {
        variant: 0,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_llama_creamy", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_cyan", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_green", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_light_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_light_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_lime", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_magenta", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_orange", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_pink", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_purple", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_red", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_creamy_yellow", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_llama_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_cyan", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_green", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_light_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_light_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_lime", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_magenta", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_orange", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_pink", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_purple", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_red", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_white_yellow", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_llama_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_cyan", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_green", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_light_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_light_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_lime", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_magenta", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_orange", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_pink", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_purple", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_red", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_brown_yellow", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_llama_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_black", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_brown", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_cyan", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_green", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_light_blue", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_light_gray", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_lime", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_magenta", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_orange", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_pink", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_purple", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_red", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_white", amount: 1, weight: 1 },
          { itemId: "toy:toy_llama_gray_yellow", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:magma_cube": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_magma_cube", amount: 1, weight: 1 }
    ]
  },
  "minecraft:mooshroom": {
    chance: 0.1,
    rolls: 1,
    type: 2 /* MarkVariant */,
    mark_vars: [
      {
        variant: 0,
        mark_variant: -1,
        loot: [
          { itemId: "toy:toy_mooshroom", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: -1,
        loot: [
          { itemId: "toy:toy_mooshroom_brown", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:mule": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_mule", amount: 1, weight: 2 },
      { itemId: "toy:toy_mule_saddled", amount: 1, weight: 1 },
      { itemId: "toy:toy_mule_saddle_chest", amount: 1, weight: 1 }
    ]
  },
  "minecraft:ocelot": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_ocelot", amount: 1, weight: 1 }
    ]
  },
  "minecraft:panda": {
    chance: 1,
    rolls: 1,
    type: 1 /* Variant */,
    vars: [
      {
        variant: 0,
        loot: [
          { itemId: "toy:toy_panda", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        loot: [
          { itemId: "toy:toy_panda_lazy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        loot: [
          { itemId: "toy:toy_panda_worried", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        loot: [
          { itemId: "toy:toy_panda_playful", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        loot: [
          { itemId: "toy:toy_panda_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        loot: [
          { itemId: "toy:toy_panda_sneezy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        loot: [
          { itemId: "toy:toy_panda_aggressive", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:parrot": {
    chance: 0.25,
    rolls: 1,
    type: 1 /* Variant */,
    vars: [
      {
        variant: 0,
        loot: [
          { itemId: "toy:toy_parrot_red_blue", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        loot: [
          { itemId: "toy:toy_parrot_blue", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        loot: [
          { itemId: "toy:toy_parrot_green", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        loot: [
          { itemId: "toy:toy_parrot_yellow_blue", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        loot: [
          { itemId: "toy:toy_parrot_gray", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:phantom": {
    chance: 0.2,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_phantom", amount: 1, weight: 1 }
    ]
  },
  "minecraft:pig": {
    chance: 0.01,
    rolls: 1,
    type: 3 /* ClimateVariant */,
    climate_vars: [
      {
        climnate_variant: "temperate",
        loot: [
          { itemId: "toy:toy_pig", amount: 1, weight: 1 }
        ]
      },
      {
        climnate_variant: "warm",
        loot: [
          { itemId: "toy:toy_pig_warm", amount: 1, weight: 1 }
        ]
      },
      {
        climnate_variant: "cold",
        loot: [
          { itemId: "toy:toy_pig_cold", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:piglin_brute": {
    chance: 0.5,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_piglin_brute", amount: 1, weight: 1 }
    ]
  },
  "minecraft:piglin": {
    chance: 0.05,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_piglin", amount: 1, weight: 1 }
    ]
  },
  "minecraft:pillager": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_pillager", amount: 1, weight: 1 }
    ]
  },
  "minecraft:polar_bear": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_polar_bear", amount: 1, weight: 1 }
    ]
  },
  "minecraft:pufferfish": {
    chance: 0.2,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_pufferfish", amount: 1, weight: 1 }
    ]
  },
  "minecraft:rabbit": {
    chance: 0.1,
    rolls: 1,
    type: 1 /* Variant */,
    vars: [
      {
        variant: 0,
        loot: [
          { itemId: "toy:toy_rabbit_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        loot: [
          { itemId: "toy:toy_rabbit_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        loot: [
          { itemId: "toy:toy_rabbit_black", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        loot: [
          { itemId: "toy:toy_rabbit_white_splotched", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        loot: [
          { itemId: "toy:toy_rabbit_gold", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        loot: [
          { itemId: "toy:toy_rabbit_salt", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:ravager": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_ravager", amount: 1, weight: 1 }
    ]
  },
  "minecraft:salmon": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_salmon", amount: 1, weight: 1 }
    ]
  },
  "minecraft:turtle": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_turtle", amount: 1, weight: 1 }
    ]
  },
  "minecraft:sheep": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_sheep_black", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_blue", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_brown", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_cyan", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_gray", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_green", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_light_blue", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_light_gray", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_lime", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_magenta", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_orange", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_pink", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_purple", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_red", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_white", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_yellow", amount: 1, weight: 1 },
      { itemId: "toy:toy_sheep_sheared", amount: 1, weight: 1 }
    ]
  },
  "minecraft:shulker": {
    chance: 0.05,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_shulker_black", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_blue", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_brown", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_cyan", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_gray", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_green", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_light_blue", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_light_gray", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_lime", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_magenta", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_orange", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_pink", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_purple", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_red", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_white", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_yellow", amount: 1, weight: 1 },
      { itemId: "toy:toy_shulker_sheared", amount: 1, weight: 1 }
    ]
  },
  "minecraft:silverfish": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_silverfish", amount: 1, weight: 1 }
    ]
  },
  "minecraft:skeleton_horse": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_horse_skeleton", amount: 1, weight: 1 },
      { itemId: "toy:toy_horse_saddled_skeleton", amount: 1, weight: 1 }
    ]
  },
  "minecraft:skeleton": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_skeleton", amount: 1, weight: 1 }
    ]
  },
  "minecraft:slime": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_slime", amount: 1, weight: 1 }
    ]
  },
  "minecraft:sniffer": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_sniffer", amount: 1, weight: 1 }
    ]
  },
  "minecraft:snow_golem": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_snow_golem", amount: 1, weight: 1 },
      { itemId: "toy:toy_snow_golem_headless", amount: 1, weight: 1 }
    ]
  },
  "minecraft:spider": {
    chance: 0.05,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_spider", amount: 1, weight: 1 }
    ]
  },
  "minecraft:squid": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_squid", amount: 1, weight: 1 }
    ]
  },
  "minecraft:stray": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_stray", amount: 1, weight: 1 }
    ]
  },
  "minecraft:strider": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_strider", amount: 1, weight: 1 },
      { itemId: "toy:toy_strider_suffocated", amount: 1, weight: 1 }
    ]
  },
  "minecraft:tadpole": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_tadpole", amount: 1, weight: 1 }
    ]
  },
  "minecraft:trader_llama": {
    chance: 0.25,
    rolls: 1,
    type: 2 /* MarkVariant */,
    mark_vars: [
      {
        variant: 0,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_llama_trader_creamy", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_llama_trader_white", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_llama_trader_brown", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_llama_trader_gray", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:tropicalfish": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_tropical_fish", amount: 1, weight: 1 }
    ]
  },
  "minecraft:vex": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_vex", amount: 1, weight: 1 },
      { itemId: "toy:toy_vex_charging", amount: 1, weight: 1 }
    ]
  },
  "minecraft:villager_v2": {
    chance: 0.3,
    rolls: 1,
    type: 2 /* MarkVariant */,
    mark_vars: [
      /* 0: plains */
      {
        variant: 0,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_unemployed", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_farmer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_fisherman", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_shepherd", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_fletcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_librarian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_cartographer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_cleric", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_armorer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_weaponsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_toolsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 11,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_butcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 12,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_leatherworker", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 13,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_stonemason", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 14,
        mark_variant: 0,
        loot: [
          { itemId: "toy:toy_plains_villager_nitwit", amount: 1, weight: 1 }
        ]
      },
      /* 1: desert */
      {
        variant: 0,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_unemployed", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_farmer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_fisherman", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_shepherd", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_fletcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_librarian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_cartographer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_cleric", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_armorer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_weaponsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_toolsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 11,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_butcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 12,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_leatherworker", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 13,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_stonemason", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 14,
        mark_variant: 1,
        loot: [
          { itemId: "toy:toy_desert_villager_nitwit", amount: 1, weight: 1 }
        ]
      },
      /* 2: jungle */
      {
        variant: 0,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_unemployed", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_farmer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_fisherman", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_shepherd", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_fletcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_librarian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_cartographer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_cleric", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_armorer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_weaponsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_toolsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 11,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_butcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 12,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_leatherworker", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 13,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_stonemason", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 14,
        mark_variant: 2,
        loot: [
          { itemId: "toy:toy_jungle_villager_nitwit", amount: 1, weight: 1 }
        ]
      },
      /* 3: savannah */
      {
        variant: 0,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_unemployed", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_farmer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_fisherman", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_shepherd", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_fletcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_librarian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_cartographer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_cleric", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_armorer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_weaponsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_toolsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 11,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_butcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 12,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_leatherworker", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 13,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_stonemason", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 14,
        mark_variant: 3,
        loot: [
          { itemId: "toy:toy_savannah_villager_nitwit", amount: 1, weight: 1 }
        ]
      },
      /* 4: snow */
      {
        variant: 0,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_unemployed", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_farmer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_fisherman", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_shepherd", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_fletcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_librarian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_cartographer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_cleric", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_armorer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_weaponsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_toolsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 11,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_butcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 12,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_leatherworker", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 13,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_stonemason", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 14,
        mark_variant: 4,
        loot: [
          { itemId: "toy:toy_snow_villager_nitwit", amount: 1, weight: 1 }
        ]
      },
      /* 5: swamp */
      {
        variant: 0,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_unemployed", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_farmer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_fisherman", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_shepherd", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_fletcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_librarian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_cartographer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_cleric", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_armorer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_weaponsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_toolsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 11,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_butcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 12,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_leatherworker", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 13,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_stonemason", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 14,
        mark_variant: 5,
        loot: [
          { itemId: "toy:toy_swamp_villager_nitwit", amount: 1, weight: 1 }
        ]
      },
      /* 6: taiga */
      {
        variant: 0,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_unemployed", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 1,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_farmer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 2,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_fisherman", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 3,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_shepherd", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 4,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_fletcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 5,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_librarian", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 6,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_cartographer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 7,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_cleric", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 8,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_armorer", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 9,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_weaponsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 10,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_toolsmith", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 11,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_butcher", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 12,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_leatherworker", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 13,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_stonemason", amount: 1, weight: 1 }
        ]
      },
      {
        variant: 14,
        mark_variant: 6,
        loot: [
          { itemId: "toy:toy_taiga_villager_nitwit", amount: 1, weight: 1 }
        ]
      }
    ]
  },
  "minecraft:vindicator": {
    chance: 0.02,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_vindicator", amount: 1, weight: 1 }
    ]
  },
  "minecraft:wandering_trader": {
    chance: 1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_wandering_trader", amount: 1, weight: 1 }
    ]
  },
  "minecraft:warden": {
    chance: 1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_warden", amount: 1, weight: 1 }
    ]
  },
  "minecraft:witch": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_witch", amount: 1, weight: 1 }
    ]
  },
  "minecraft:wither": {
    chance: 1,
    rolls: 1,
    type: 0 /* Basic */,
    player_drop: true,
    /* drop at player not mob */
    loot: [
      { itemId: "toy:toy_wither", amount: 1, weight: 1 },
      { itemId: "toy:toy_wither_invulnerable", amount: 1, weight: 1 }
    ]
  },
  "minecraft:wither_skeleton": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_wither_skeleton", amount: 1, weight: 1 }
    ]
  },
  "minecraft:wolf": {
    chance: 0.25,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_wolf", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_ashen", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_black", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_chestnut", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_rusty", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_snowy", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_spotted", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_striped", amount: 1, weight: 1 },
      { itemId: "toy:toy_wolf_woods", amount: 1, weight: 1 }
    ]
  },
  "minecraft:zoglin": {
    chance: 0.3,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_zoglin", amount: 1, weight: 1 }
    ]
  },
  "minecraft:zombie_pigman": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_piglin_zombified", amount: 1, weight: 1 }
    ]
  },
  "minecraft:zombie_villager_v2": {
    chance: 0.05,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_zombie_villager", amount: 1, weight: 1 }
    ]
  },
  "minecraft:zombie": {
    chance: 0.01,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_zombie", amount: 1, weight: 1 }
    ]
  },
  "minecraft:zombie_horse": {
    chance: 0.1,
    rolls: 1,
    type: 0 /* Basic */,
    loot: [
      { itemId: "toy:toy_horse_zombie", amount: 1, weight: 1 },
      { itemId: "toy:toy_horse_saddled_zombie", amount: 1, weight: 1 }
    ]
  }
};
var mob_loot = new CustomPlayerKillMobLoot(mob_loot_table);
world2.afterEvents.entityDie.subscribe((entityDieAfterEvent) => {
  mob_loot.onEntityDie(entityDieAfterEvent);
});
var creaking = new CreakingToyDrop(0.1, "toy:toy_creaking");
world2.afterEvents.entityHitEntity.subscribe((entityHitEntity) => {
  creaking.onEntityHit(entityHitEntity);
});
export {
  mob_loot_table
};

//# sourceMappingURL=../../dist/debug/main.js.map
