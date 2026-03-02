import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect with Spotify to start organizing
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full max-w-sm",
              cardBox: "shadow-none border border-border bg-card",
              card: "bg-card shadow-none",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "bg-secondary text-foreground border-border hover:bg-secondary/80",
              socialButtonsBlockButtonText: "text-foreground font-medium",
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/80",
              identityPreviewText: "text-foreground",
              identityPreviewEditButton: "text-primary",
              formFieldLabel: "text-foreground",
              formFieldInput:
                "bg-secondary border-border text-foreground",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
            },
          }}
        />
      </div>
    </main>
  )
}
