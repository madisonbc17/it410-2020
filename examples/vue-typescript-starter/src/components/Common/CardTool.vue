<template>
    <div ref="cardRef" class="card-tool float-right">
        <em v-if="refresh" @click="handleRefresh" class="fas fa-sync"></em>
        <em v-if="dismiss" @click="handleDismiss" class="fa fa-times"></em>
    </div>
</template>
<script lang="ts">

    import { Component, Prop, Vue } from 'vue-property-decorator';

    // Card Tools
    // -----------------------------------


    /**
     * Helper function to find the closest
     * ascending .card element
     */
    function getCardParent(item: HTMLDivElement | null) {
        var el = item && item.parentElement;
        while (el && !el.classList.contains('card'))
            el = el.parentElement
        return el
    }


    /**
     * Add action icons to card components to allow
     * refresh data or remove a card element
     */
    @Component
    export default class CardTool extends Vue {
        /** show the refreshe icon */
        @Prop({default: false}) private refresh!: Boolean;
        /** show the remove icon */
        @Prop({default: false}) private dismiss!: Boolean;
        /** triggers before card is removed */
        @Prop({default: () => {}}) private onRemove!: Function;
        /** triggers after card was removed */
        @Prop({default: () => {}}) private onRemoved!: Function;
        /** triggers when user click on refresh button */
        @Prop({default: () => {}}) private onRefresh!: Function;
        /** name if the icon class to use as spinner */
        @Prop({default: 'standard'}) private spinner!: string;


        handleDismiss (e: MouseEvent) {
            // find the first parent card
            const card = getCardParent(this.$refs.cardRef as HTMLDivElement) as HTMLDivElement;

            const destroyCard = () => {
                // remove card
                if (card && card.parentNode) card.parentNode.removeChild(card);
                // An event to catch when the card has been removed from DOM
                this.onRemoved();
            }

            const animate = (item: HTMLDivElement | null, cb: Function) => {
                if (item && 'onanimationend' in window) { // animation supported
                    const animationEndCallback = () => {
                        cb.call(this) // no animation, just remove
                        item.removeEventListener('animationeend', animationEndCallback);
                    };
                    // animation supported
                    item.addEventListener('animationend', animationEndCallback);
                    item.className += ' animated bounceOut'; // requires animate.css
                } else cb.call(this) // no animation, just remove
            }

            const confirmRemove = function() {
                animate(card, function() {
                    destroyCard();
                })
            }

            // Trigger the event and finally remove the element
            this.onRemove(card, confirmRemove);

        }
        handleRefresh (e: MouseEvent) {
            const WHIRL_CLASS = 'whirl';
            const card = getCardParent(this.$refs.cardRef as HTMLDivElement) as HTMLDivElement;

            const showSpinner = function(card: HTMLDivElement, spinner: Array<string>) {
                card.classList.add(WHIRL_CLASS);
                spinner.forEach(s => card.classList.add(s));
            };

            // method to clear the spinner when done
            const done = () => { card.classList.remove(WHIRL_CLASS); }
            // start showing the spinner
            showSpinner(card, this.spinner.split(' '));
            // event to remove spinner when refres is done
            this.onRefresh(card, done);
        }
    }

</script>