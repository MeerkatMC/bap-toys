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
    climnate_variant?: string;
    mark_variant?: number;
    loot: LootDrop [];
};

export type LootEntry = {
  chance: number;
  rolls: number;
  player_drop?: boolean;
  variants?: VarDrop [];
  loot?: LootDrop [];
};

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

        console.log( "Looking for type", deadEntity.typeId );

        const mob_entry = this.loot_table[deadEntity.typeId];
        if ( mob_entry ) {
            let mob_loot_array  = null
            let mob_loot_chance = (mob_entry.chance !== undefined ? mob_entry.chance : 0.1)
            let mob_loot_rolls  = (mob_entry.rolls !== undefined ? mob_entry.rolls : 1)
            let mob_loot_player_drop = (mob_entry.player_drop !== undefined ? mob_entry.player_drop : false )

            /* First look for variated mob loot tables.. */
            if ( mob_entry.variants !== undefined ) {
                let variant_component      = deadEntity.getComponent( 'minecraft:variant');
                let mark_variant_component = deadEntity.getComponent( 'minecraft:mark_variant');
        
                if ( ( variant_component !== undefined ) && ( mark_variant_component === undefined ) ) {
                    let variant_id = variant_component.value;
                    console.log( "Looking for variant", variant_id );
    
                    const variant = mob_entry.variants.find(v => v.variant === variant_id);
                    if ( variant ) mob_loot_array = variant.loot;
                } 
                else if ( ( variant_component !== undefined ) && ( mark_variant_component !== undefined ) ) {
                    let variant_id = variant_component.value;
                    let mark_id = mark_variant_component.value;
                    console.log( "Looking for variant", variant_id, mark_id );
    
                    const variant = mob_entry.variants.find(v => v.variant === variant_id && v.mark_variant === mark_id );
                    if ( variant ) mob_loot_array = variant.loot;
                }
            }

            /* If not found look for simple or fallback loot table */
            if ( ( mob_loot_array === null ) && ( mob_entry.loot !== undefined ) )
                mob_loot_array = mob_entry.loot;
    
            /* If we got a loot table then rng and spawn if successfull */
            if (mob_loot_array) {
                const lootItem = this.get_random_loot( mob_loot_array, mob_loot_chance, mob_loot_rolls );
                if (lootItem) {
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

        console.log( "random", random );
        if ( random < mob_loot_chance ) {
            console.log( "Mob Loot Will Drop..." );

            let totalWeight = mob_loot_array.reduce((sum, lootItem) => sum + lootItem.weight, 0);
            let randomLootValue = Math.random() * totalWeight;

            for ( let i = 0; i < mob_loot_rolls; i++ ) {
                let weightSum = 0;
                for (let lootItem of mob_loot_array) {
                    weightSum += lootItem.weight;
                    if (randomLootValue <= weightSum) {
                        console.log("Loot Drop: ", lootItem.itemId);
                        return lootItem.itemId ? lootItem : null;
                    }
                }
            }
        }

        return null;
    }
}
