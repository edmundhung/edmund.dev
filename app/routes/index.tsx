import type { LoaderFunction } from "remix";
import { redirect } from "remix";

export let loader: LoaderFunction = async () => {
  return redirect('/blog');
};

export default function Index() {
  return null;
}
