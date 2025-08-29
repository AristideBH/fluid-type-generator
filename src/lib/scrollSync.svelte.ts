
export class ScrollSync {
    scrollDivs: HTMLDivElement[];
    activeScrollIndex = $state<number | null>(null);
    isSyncing = $state(false);
    debounceTimer: number | null = null;

    constructor(scrollDivs: HTMLDivElement[]) {
        this.scrollDivs = scrollDivs;
    }
    onScroll(index: number) {
        if (this.isSyncing) return;
        this.activeScrollIndex = index;

        // Debounce syncing
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = window.setTimeout(() => {
            this.syncScroll();
        }, 1); // 60ms debounce, adjust as needed
    }

    syncScroll() {
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
        // Allow browser to finish scrolling before re-enabling
        setTimeout(() => {
            this.isSyncing = false;
        }, 1);
    }
}