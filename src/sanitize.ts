/** LLM 出力に混入する XML タグを除去して前後の空白を trim する */
export function sanitize(input: string): string {
	return input.replace(/<\/?[^>]+>/g, "").trim();
}
