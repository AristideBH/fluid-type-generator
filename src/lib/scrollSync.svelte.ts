// src/lib/scrollSync.svelte.ts

export class ScrollSync {
    scrollDivs = $state<HTMLDivElement[]>([]);
    activeScrollIndex = $state<number | null>(null);
    isSyncing = $state(false);

    setDivs(divs: HTMLDivElement[]) {
        this.scrollDivs = divs;
    }

    onScroll(index: number) {
        if (!this.isSyncing) {
            this.activeScrollIndex = index;
        }
    }

    $effect() {
        if (this.activeScrollIndex === null) return;
        const source = this.scrollDivs[this.activeScrollIndex];
        if (!source) return;
        const percent =
            source.scrollWidth > source.clientWidth
                ? source.scrollLeft / (source.scrollWidth - source.clientWidth)
                : 0;
        this.isSyncing = true;
        this.scrollDivs.forEach((el, i) => {
            if (i !== this.activeScrollIndex && el) {
                const maxScroll = el.scrollWidth - el.clientWidth;
                el.scrollLeft = percent * maxScroll;
            }
        });
        requestAnimationFrame(() => {
            this.isSyncing = false;
        });
    }
}
