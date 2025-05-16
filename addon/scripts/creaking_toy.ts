import { EntityHitEntityAfterEvent, ItemStack } from '@minecraft/server';

export class CreakingToyDrop
{
    drop_chance: number;
    drop_item: string;

    constructor( drop_chance: number, drop_item: string )
    {
        this.drop_chance = drop_chance;
        this.drop_item = drop_item;
    }   /* constructor() */

    onEntityHit( entityHitEntity: EntityHitEntityAfterEvent )
    {
        const { hitEntity,  damagingEntity } = entityHitEntity;

        if ( (damagingEntity === undefined ) || ( hitEntity === undefined ) )
            return;

        if ( (hitEntity.typeId !== "minecraft:creaking" ) || ( damagingEntity.typeId !== "minecraft:player" ) )
            return;

        if ( Math.random() < this.drop_chance )
        {
            hitEntity.dimension.spawnItem( new ItemStack( this.drop_item, 1), hitEntity.location );
        }
    }
}
