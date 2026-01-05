import { addToast, closeToast } from "@heroui/react";

type NotifyAsyncOptions<T> = {
  loadingTitle?: string;
  loadingDescription?: string;

  successTitle?: string;
  successDescription?: string | ((data: T) => string);

  errorTitle?: string;
  errorDescription?: string | ((error: unknown) => string);

  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
};

export async function notifyAsync<T>(
  promiseFn: () => Promise<T>,
  options: NotifyAsyncOptions<T>
): Promise<T> {
  const promise = promiseFn();

  const toastId: string = addToast({
    title: options.loadingTitle ?? "Processing",
    description: options.loadingDescription ?? "Please wait…",
    promise,
  }) as string;

  try {
    const data = await promise;

    closeToast(toastId);

    options.onSuccess?.(data);

    addToast({
      title: options.successTitle ?? "Success",
      description:
        typeof options.successDescription === "function"
          ? options.successDescription(data)
          : (options.successDescription ?? "Completed successfully 🎉"),
    });

    return data;
  } catch (error) {
    closeToast(toastId);

    options.onError?.(error);

    addToast({
      title: options.errorTitle ?? "Error",
      description:
        typeof options.errorDescription === "function"
          ? options.errorDescription(error)
          : (options.errorDescription ?? "Something went wrong ❌"),
    });

    throw error;
  }
}
