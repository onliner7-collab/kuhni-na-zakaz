import { ExploreContextProvider } from "./ExploreContext";
import { RelatedExplorationRail } from "./RelatedExplorationRail";

export function ServiceExplorationRail({ route }: { route: string }) {
  return (
    <ExploreContextProvider sourceRoute={route}>
      <div className="mt-12">
        <RelatedExplorationRail route={route} state="RESULT" />
      </div>
    </ExploreContextProvider>
  );
}
