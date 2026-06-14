ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "admin_all_users" ON "User";
DROP POLICY IF EXISTS "client_own_user" ON "User";
DROP POLICY IF EXISTS "admin_all_clients" ON "Client";
DROP POLICY IF EXISTS "client_own_client" ON "Client";
DROP POLICY IF EXISTS "admin_all_leads" ON "Lead";
DROP POLICY IF EXISTS "client_own_leads" ON "Lead";
DROP POLICY IF EXISTS "admin_all_invoices" ON "Invoice";
DROP POLICY IF EXISTS "client_own_invoices" ON "Invoice";
DROP POLICY IF EXISTS "admin_all_messages" ON "Message";
DROP POLICY IF EXISTS "client_own_messages" ON "Message";
DROP POLICY IF EXISTS "admin_all_security_events" ON "SecurityEvent";

CREATE POLICY "admin_all_users" ON "User"
  FOR ALL USING (current_setting('app.role', true) = 'ADMIN')
  WITH CHECK (current_setting('app.role', true) = 'ADMIN');

CREATE POLICY "client_own_user" ON "User"
  FOR ALL USING ("id" = current_setting('app.user_id', true))
  WITH CHECK ("id" = current_setting('app.user_id', true));

CREATE POLICY "admin_all_clients" ON "Client"
  FOR ALL USING (current_setting('app.role', true) = 'ADMIN')
  WITH CHECK (current_setting('app.role', true) = 'ADMIN');

CREATE POLICY "client_own_client" ON "Client"
  FOR SELECT USING ("id" = current_setting('app.client_id', true));

CREATE POLICY "admin_all_leads" ON "Lead"
  FOR ALL USING (current_setting('app.role', true) = 'ADMIN')
  WITH CHECK (current_setting('app.role', true) = 'ADMIN');

CREATE POLICY "client_own_leads" ON "Lead"
  FOR ALL USING ("clientId" = current_setting('app.client_id', true))
  WITH CHECK ("clientId" = current_setting('app.client_id', true));

CREATE POLICY "admin_all_invoices" ON "Invoice"
  FOR ALL USING (current_setting('app.role', true) = 'ADMIN')
  WITH CHECK (current_setting('app.role', true) = 'ADMIN');

CREATE POLICY "client_own_invoices" ON "Invoice"
  FOR SELECT USING ("clientId" = current_setting('app.client_id', true));

CREATE POLICY "admin_all_messages" ON "Message"
  FOR ALL USING (current_setting('app.role', true) = 'ADMIN')
  WITH CHECK (current_setting('app.role', true) = 'ADMIN');

CREATE POLICY "client_own_messages" ON "Message"
  FOR ALL USING ("clientId" = current_setting('app.client_id', true))
  WITH CHECK ("clientId" = current_setting('app.client_id', true));

CREATE POLICY "admin_all_security_events" ON "SecurityEvent"
  FOR ALL USING (current_setting('app.role', true) = 'ADMIN')
  WITH CHECK (current_setting('app.role', true) = 'ADMIN');
