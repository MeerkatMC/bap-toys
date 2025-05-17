/* 
 * Description: This file contains all of the custom loot drops logic
 */
import { ItemStack, world, EntityDieAfterEvent } from '@minecraft/server';

export type LootDrop = {
  itemId: string;
  amount: number;
  weight: number;
};

export type VarDrop = {
    variant?: number;
    loot: LootDrop [];
};

export type MarkVarDrop = {
    variant: number;
    mark_variant: number;
    loot: LootDrop [];
};

export type ClimateVarDrop = {
    climnate_variant?: string;
    loot: LootDrop [];
};

export enum LootType {
  Basic = 0,
  Variant = 1,
  MarkVariant = 2,
  ClimateVariant = 3
};

//static readonly componentId = 'minecraft:color'; like sheep...

export type LootEntryBase = {
    chance: number;
    rolls: number;
    player_drop?: boolean;
};

export type LootEntry =
  | (LootEntryBase & { type: LootType.Basic; loot: LootDrop[]; })
  | (LootEntryBase & { type: LootType.Variant; vars: VarDrop[]; })
  | (LootEntryBase & { type: LootType.MarkVariant; mark_vars: MarkVarDrop[]; })
  | (LootEntryBase & { type: LootType.ClimateVariant; climate_vars: ClimateVarDrop[]; });

export class CustomPlayerKillMobLoot
{
    loot_table: Record<string, LootEntry>;

    constructor( loot_table: Record<string, LootEntry> )
    {
        this.loot_table = loot_table;
    }   /* constructor() */

    onEntityDie( entityDieAfterEvent: EntityDieAfterEvent )
    {
        const { deadEntity, damageSource: { damagingEntity } } = entityDieAfterEvent;
        
        /* We only want custom drops if the entity was killed by a player */
        if ( (damagingEntity === undefined ) || ( damagingEntity.typeId !== "minecraft:player" ) )
            return;

        const mob_entry = this.loot_table[deadEntity.typeId];
        if ( mob_entry ) {
            let mob_loot_array  = null
            let mob_loot_player_drop = (mob_entry.player_drop !== undefined ? mob_entry.player_drop : false )

            switch( mob_entry.type ){
                case LootType.Basic:
                    mob_loot_array = mob_entry.loot;
                    break;
                case LootType.Variant:
                    {
                        let vc = deadEntity.getComponent( 'minecraft:variant');
                        if ( vc !== undefined )
                        {
                            const variant = mob_entry.vars.find(v => v.variant === vc.value);
                            if ( variant ) {
                                mob_loot_array = variant.loot;
                            }
                        }
                    }
                    break;
                case LootType.MarkVariant:
                    {
                        let vc = deadEntity.getComponent( 'minecraft:variant'); 
                        let mv = deadEntity.getComponent( 'minecraft:mark_variant');
                        if ( vc !== undefined && mv !== undefined )
                        {
                            const variant = mob_entry.mark_vars.find(v => v.variant === vc.value && v.mark_variant === mv.value );
                            if ( variant ) {
                                mob_loot_array = variant.loot;
                            }
                        }
                    }
                    break;
                case LootType.ClimateVariant:
                    {
                        let cv = deadEntity.getProperty( 'minecraft:climate_variant' );
                        if ( cv !== undefined )
                        {
                            const variant = mob_entry.climate_vars.find( v => v.climnate_variant === cv );
                            if ( variant ) {
                                mob_loot_array = variant.loot;
                                console.log("Climate Variant: ", cv );
                            }
                        }
                    }
                    break;
                default:
                    /* ??? */
                    break;
            }

            /* If we got a loot table then rng and spawn if successfull */
            if (mob_loot_array) {
                const lootItem = this.get_random_loot( mob_loot_array, mob_entry.chance, mob_entry.rolls );
                if (lootItem) {
                    console.log( "Spawn loot: ",  lootItem.itemId );
                    if ( mob_loot_player_drop )
                        damagingEntity.dimension.spawnItem(new ItemStack(lootItem.itemId, lootItem.amount), damagingEntity.location);    
                    else
                        damagingEntity.dimension.spawnItem(new ItemStack(lootItem.itemId, lootItem.amount), deadEntity.location);
                }         
            }
        }
    }

    get_random_loot( mob_loot_array: LootDrop [], mob_loot_chance: number, mob_loot_rolls: number ) : LootDrop | null
    {
        let random = Math.random();

        if ( random < mob_loot_chance ) {
            let totalWeight = mob_loot_array.reduce((sum, lootItem) => sum + lootItem.weight, 0);
            let randomLootValue = Math.random() * totalWeight;

            for ( let i = 0; i < mob_loot_rolls; i++ ) {
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
}
