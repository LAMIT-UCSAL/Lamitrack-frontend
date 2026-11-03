import { useEffect, useRef, useState } from "react";

import "./CategoryTabs.scss";

type CategoryTabsProps = {
  options: readonly string[];
  active: string;
  onChange: (option: string) => void;
  label: string;
};

// Filtro em trilho (padrão .category-tabs da loja). Cada item é um botão de
// alternância com aria-pressed; no celular o trilho rola para o lado e a borda
// direita esmaece enquanto ainda houver itens escondidos.
export function CategoryTabs({
  options,
  active,
  onChange,
  label,
}: CategoryTabsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      setHasMore(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [options]);

  return (
    <div
      ref={trackRef}
      className={hasMore ? "category-tabs has-more" : "category-tabs"}
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            type="button"
            className={
              isActive ? "category-tabs__btn is-active" : "category-tabs__btn"
            }
            aria-pressed={isActive}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
